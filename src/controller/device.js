import {
  MAC_ISINVALID,
  MAC_EXIST,
  MAC_ISNOTFOUND,
  NAMED_ISINVALID,
  DESCRIPTION_ISEMPTY,
  LOCATION_ISINVALID,
  LOCATION_ISNOTFOUND,
  POSITION_ISINVALID
} from "../exceptions/deviceException";
import { UNEXPECTED_ERROR } from "../exceptions/serverException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function postDevice(req, res) {
  const { mac, name, description, location, position } = req.body;
  
  if (!body.mac || body.mac == "" || body.mac.length !== 17)
    return res.status(400).send(MAC_ISINVALID);

  await verifyReq(req.body, res);

  if (await isExist(mac)) {
    return res.send(MAC_EXIST);
  }
  

  try {
    const device = new Device({
      mac,
      name,
      description,
      location,
      position
    });

    await device.save();
    const loca = await Location.findById(location);

    loca.device.push(device._id);
    await loca.save();

    req.io.emit("postDevice", device);
    return res.status(201).json(device);
  } catch (e) {
    console.log(e);
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

export async function getDevice(req, res, next) {
  const mac = req.params.mac;
  let filter = {};
  if (mac) filter.mac = mac;

  res.send(
    await Device.find(filter)
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
  if (! await isExist(req.params.mac)) { return res.send(MAC_ISNOTFOUND) }

  await verifyReq(req.body, res);

  const fields = ['name','description','location','position'];

  Object.entries(req.body).forEach(([key, value]) => {
    if(!fields.includes(key) || value === ""){
      return res.send({required: fields});//Por um melhor retorno
    }
  });

  const dev = await Device.findOne({mac: req.params.mac});

  try{
    
    const loca = await Location.findById(dev.location);
    (loca.device.indexOf(dev._id) !== -1) ? loca.device.splice(loca.device.indexOf(dev._id), 1) : "";
    await loca.save();
  }catch(e){
    console.log(e);
  }

  await Device.updateOne({ mac: req.params.mac },
    {
      $set: {
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        position: req.body.position,
      }
    }
  );
    
  try{
    const new_loca = await Location.findById(req.body.location);
    (new_loca.device.indexOf(dev._id) !== -1) ? new_loca.device.splice(new_loca.device.indexOf(dev._id), 1):"";
    new_loca.device.push(dev._id);
    await new_loca.save();
  } catch(e){
    console.log(e);
  }

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

export async function verifyReq(body, res){

  if (!body.name || body.name == "" || body.name.length < 3 || body.name.length > 80)
    return res.status(400).send(NAMED_ISINVALID);

  if (!body.location || body.location == "")
    return res.status(400).send(LOCATION_ISINVALID);

  if (!body.position || !(body.position.x>-1) || !(body.position.y>-1))
    return res.status(400).send(POSITION_ISINVALID);

  try{
    if(! await Location.findById(body.location)) return res.send(LOCATION_ISNOTFOUND);
  } catch(e){
    return res.send(LOCATION_ISINVALID);
  }
}