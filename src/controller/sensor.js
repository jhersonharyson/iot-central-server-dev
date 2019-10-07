import { MAC_ISINVALID, MAC_ISNOTFOUND } from "../exceptions/deviceException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import Event from "../models/event";
import { jwtBuilder } from "../security/jwtBuilder";
import moment from "moment";
const constants = global.constants;

export async function postSensor(req, res) {
  try {
    const {
      userId: mac,
      body: { sensorData }
    } = req;

    const device = await isExist(mac);
    if (!device) {
      return res.send(MAC_ISNOTFOUND);
    }

    const { _id: deviceId, location, position } = device;
    if (mac) {
      try {
        await Promise.all(
          sensorData.map(async function(arr) {
            const incident = await verify_event(arr);
            console.log(incident);
            if (incident && incident.description) {
              req.io.emit("postEvent", incident);
            }
            let { type, value } = arr;
            const sensor = new Sensor({
              deviceId,
              type,
              value,
              location,
              position
            });
            await sensor.save();

            device.sensorData.push(sensor._id);
            await device.save();
          })
        );

        let sensorsByDevice = await Device.find({})
          .select("_id")
          .where("location")
          .equals(device.location)
          .populate({
            path: "sensorData",
            select: "value -_id",
            options: {
              limit: 1,
              sort: {
                createAt: -1
              }
            }
          });

        let maxSensorValue = -1;
        let sumSensorValue = sensorsByDevice.reduce(
          (sumSensorByDevice, sensorByDevice) => {
            if (!sensorByDevice.sensorData[0]) return (sumSensorByDevice += 0);

            let sensorByDeviceValue = sensorByDevice.sensorData[0].value;

            if (sensorByDeviceValue > maxSensorValue)
              maxSensorValue = sensorByDeviceValue;

            return (sumSensorByDevice += sensorByDeviceValue);
          },
          0
        );

        req.io.emit("redrawLocationGraphic", {
          location: (await Location.findById(device.location, "name")).name,
          avg: Math.floor(
            sensorsByDevice.length ? sumSensorValue / sensorsByDevice.length : 0
          ),
          max: maxSensorValue
        });
      } catch (e) {
        return res.status(400).send({ error: e });
      }

      res.send({
        status: "ok",
        token: jwtBuilder({ id: deviceId })
      });
    } else {
      return res.status(401).send(MAC_ISINVALID);
    }
  } catch (e) {
    res.status(500).send({ error: e });
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
  const sensors = await Sensor.find()
    .where("createAt")
    .gte(moment().subtract(1, "day"));

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
        await incident.save();
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
