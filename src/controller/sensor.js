import { MAC_ISINVALID, MAC_ISNOTFOUND } from "../exceptions/deviceException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import Event from "../models/event";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function postSensor(req, res) {
  try {
    const { token, sensorData } = req.body;
    const mac = req.userId;
    const device = await isExist(req.userId);
    if (!device) {
      return res.send(MAC_ISNOTFOUND);
    }

    const deviceId = device._id;
    const location = device.location;
    const position = device.position;

    if (mac) {
      try {
        await sensorData.map(async function(arr) {
          let type = arr.type;
          let value = arr.value;
          const sensor = new Sensor({
            deviceId,
            type,
            value,
            location,
            position
          });
          await sensor.save();
          const device = await Device.findById(deviceId);

          device.sensorData.push(sensor._id);
          await device.save();

          const verify_resp = await verify_event(sensor);
          if (verify_resp) {
            console.log("emmitind");
            req.io.emit("postEvent", verify_resp);
          }
        });
      } catch (e) {
        return res.status(400).send({ error: e });
      }

      req.io.emit("postSensor", sensorData);
      res.send({ status: "ok", token: jwtBuilder({ id: deviceId }) });
    } else {
      return res.status(401).send(MAC_ISINVALID);
    }
  } catch (e) {
    res.send({ error: e });
  }
}

export async function getSensor(req, res, next) {
  const mac = req.params.mac;

  res.send(
    await Sensor.find()
      .select("-_id")
      .populate({
        path: "deviceId",
        model: "device",
        select: "mac name -_id"
      })
      .populate({
        path: "location",
        select: "name description -_id"
      })
  );
}

export async function test(req, res, next) {
  const r = req.params.delete;
  if (r) {
    if (r === "sensor") {
      await Sensor.deleteMany({});
    } else if (r === "device") {
      await Device.deleteMany({});
    } else if (r === "location") {
      await Location.deleteMany({});
    }
  }
}

export async function isExist(mac) {
  const data = await Device.findOne({ mac: mac, status: { $ne: -1 } });
  return data ? data : false;
}

export async function getAllSensors(req, res) {
  const sensors = await Sensor.find({}); //.populate("deviceId");

  res.send(sensors);
}

const verify_event = async sensor => {
  const s = sensor;

  if (s.value >= 4000) {
    const e = await Event.find({}).countDocuments();

    if (e == 0) {
      try {
        const evs = await Event.create({
          type: s.type,
          description: `${new Date().toLocaleString()} - Nível de ${
            s.type
          } em ${s.value} ppm`,
          sensorData: [s._id]
        });
        console.log("create");
        return evs;
      } catch (e) {
        console.log(e);
      }
    } else {
      const evs = await Event.find({});

      const incident = evs.find(e => {
        console.log(e.createAt.getTime() + " - " + Date.now());
        return e.createAt.getTime() + 10 * 1000 * 60 > Date.now() == true;
      });
      if (incident) {
        incident.sensorData.push(s._id);
        incident.description = `${new Date().toLocaleString()} - Nível de ${
          s.type
        } em ${s.value} ppm`;
        incident.save();
        return incident;
      } else {
        try {
          const evs = await Event.create({
            type: s.type,
            description: `${new Date().toLocaleString()} - Nível de ${
              s.type
            } em ${s.value} ppm`,
            sensorData: [s._id]
          });
          console.log("create");
          return evs;
        } catch (e) {
          console.log(e);
        }
      }
    }
  }
};
