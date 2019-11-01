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

    const { _id: deviceId, name, location, position } = device;
    if (mac) {
      try {
        await Promise.all(
          sensorData.map(async function(arr) {
            let { type, value } = arr;
            const sensor = new Sensor({
              deviceId,
              type,
              value,
              location,
              position
            });

            await sensor.save();

            req.io.emit("postSensor", {
              value,
              createAt: sensor.createAt,
              location,
              position,
              device,
              deviceName: device.name
            });

            const incident = await verify_event(sensor);
            if (incident && incident.description) {
              req.io.emit("postEvent", { ...incident, sensor });
            }

            device.sensorData.push(sensor._id);
            await device.save();
          })
        );

        let locationsForUpdate = (await Location.find(
          {
            status: { $eq: 1 },
            _id: location
          },
          "_id name"
        ).populate({
          path: "device",
          match: {
            status: { $eq: 1 }
          },
          select: "_id",
          populate: {
            path: "sensorData",
            select: "value",
            options: {
              sort: { createAt: -1 },
              limit: 1
            }
          }
        }))
          .filter(
            location =>
              location.device.length &&
              location.device.some(device => device.sensorData.length)
          )
          .map(location => {
            let avg = location.device.reduce(
              (avg, device, deviceIndex, devices) => {
                if (devices.length === deviceIndex + 1) {
                  return (avg + device.sensorData[0].value) / devices.length;
                }

                return avg + device.sensorData[0].value;
              },
              0
            );

            let max = location.device.reduce(
              (max, device) =>
                device.sensorData[0].value > max
                  ? device.sensorData[0].value
                  : max,
              0
            );

            return {
              _id: location._id,
              name: location.name,
              max: max - avg,
              avg
            };
          });

        req.io.emit("redrawLocationGraphic", locationsForUpdate);
      } catch (e) {
        return res.status(400).send({ error: e });
      }

      res.send({
        status: "ok",
        token: jwtBuilder({ id: mac })
      });
    } else {
      return res.status(401).send(MAC_ISINVALID);
    }
  } catch (e) {
    res.status(500).send({ error: e });
  }
}

export async function getSensor(req, res, next) {
  const id = req.params.id;
  try {
    const sensor = await Sensor.findById(id)
      .populate({
        path: "deviceId",
        model: "device",
        select: "mac name -_id"
      })
      .populate({
        path: "location",
        select: "name description -_id"
      });
    res.send({ sensor });
  } catch (e) {
    res.status(304).send({ error: e });
  }
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

  if (s.value >= 1000) {
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
