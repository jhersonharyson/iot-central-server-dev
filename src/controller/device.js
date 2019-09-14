import {
  MAC_ISINVALID,
  MAC_EXIST,
  MAC_ISNOTFOUND,
  NAMED_ISINVALID,
  DESCRIPTION_ISEMPTY,
  LOCATION_ISINVALID,
  POSITION_ISINVALID
} from "../exceptions/deviceException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function postDevice(req, res) {
  const { mac, name, description, location, position } = req.body;

  if (await Device.findOne({ mac: mac })) return res.send(MAC_EXIST);

  if (!mac || mac == "" || mac.length !== 17)
    return res.status(400).send(MAC_ISINVALID);

  if (!name || name == "" || name.length < 3 || name.length > 80)
    return res.status(400).send(NAMED_ISINVALID);

  if (!description) return res.status(400).send(DESCRIPTION_ISEMPTY);

  if (!location || location == "")
    return res.status(400).send(LOCATION_ISINVALID);

  if (!position || position == {})
    return res.status(400).send(POSITION_ISINVALID);

  try {
    const device = await new Device({
      mac,
      name,
      description,
      location,
      position
    }).save();

    req.io.emit("postDevice", device);
    return res.status(201).json(device);
  } catch (e) {
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

export async function getDevice(req, res, next) {
  const mac = req.params.mac;
  let filter = {};
  if (mac) filter.mac = mac;

  res.send(
    await Device.find({})
      .populate("sensorData")
      .populate("location")
  );
}

export async function getDeviceData(req, res, next) {
  const mac = req.params.mac;
  let filter = {};
  filter.mac = mac;

  let popuSensor = {
    path: "sensorData",
    model: "sensor",
    select: "type value createAt -_id",
    options: {
      limit: req.query.limit,
      sort: {
        createAt: -1
      }
    }
  };

  let ref = ["limit", "type", "page"];

  Object.entries(req.query).forEach(([key, value]) => {
    if (!ref.includes(key)) filter[key] = value;
  });

  if (req.query.type) popuSensor.options.find = { type: req.query.type };
  if (req.query.limit)
    popuSensor.options.skip =
      parseInt(req.query.limit) *
      (req.query.page ? parseInt(req.query.page) - 1 : 0);

  res.send(
    await Device.find(filter)
      .select("sensorData")
      .populate(popuSensor)
  );
}

export async function deleteDevice(req, res, next) {
  if (!(await isExist(req.params.mac))) {
    return res.send(MAC_ISNOTFOUND);
  }

  await Device.updateOne(
    { mac: req.params.mac },
    {
      $set: { status: -1 }
    }
  );

  req.io.emit("deleteDevice", req.params.mac);
  res.send({ status: "deletado", mac: req.params.mac });
}

export async function updateDevice(req, res, next) {
  if (!(await isExist(req.params.mac))) {
    return res.send(MAC_ISNOTFOUND);
  }

  await Device.updateOne(
    { mac: req.params.mac },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        position: req.body.position
      }
    }
  );

  const up = await isExist(req.params.mac);

  req.io.emit("updateDevice", up);
  res.send(up);
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
