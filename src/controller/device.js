import { MAC_ISINVALID } from "../exceptions/deviceException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function postDevice(req, res) {
  try {
    const { token, sensorData } = req.body;

    
    const mac = req.userId;
    const device = await Device.findOne({ mac: mac });
    
    
    //console.log(deviceData);

    const deviceId = device._id;
    const location = device.location;
    const position = device.position;

    if(mac){

      try{

        sensorData.map(function(arr){
          let type = arr.type;
          let value = arr.value;
          const sensor = new Sensor({
            deviceId,
            type,
            value,
            location,
            position
          });
          sensor.save();
          console.log(sensor._id);
          Device.updateOne({_id: deviceId}, {$push : {sensorData: sensor._id}}, function (error, success) {})
        });
       }catch(e){
        console.log(e);
        return res.status(400).send({ error: e });
       }
      res.send({ status: "ok", token: jwtBuilder({ id: deviceId }) });
      console.log("saved!");
    } else {
      res.status(401).send(MAC_ISINVALID);
    }
  } catch (e) {
    console.log({ error: e });
    res.send({ error: e });
  }
}

export async function getDevice(req, res, next) {
  const mac = req.params.mac;
  res.send(await Device.find((mac) ? {mac: mac} : {}).populate({
    path: 'sensorData',
    model: 'sensor',
    select: 'type value createAt -_id',
    options: { limit: 10, sort: {createAt: -1}}
  }).populate({ 
    path: 'location', 
    select: 'name description -_id' 
  }))//.sort([["data", "descending"]]););
}

export async function deleteDevice(req, res, next){
  const tg = await Device.findOne({mac: req.params.mac});
  console.log(tg._id);
  await Device.deleteOne({mac: req.params.mac}, function(err){
    if(err)
      res.send(err);
    else
      Sensor.deleteMany({deviceId: tg._id}, function(err){
        if(err)
          res.send(err);
        else
          res.send({status: "deletado", mac: req.params.mac});
      })
  })
  
}


export async function updateDevice(req, res, next){
  await Device.updateOne({mac: req.params.mac}, 
    {$set : {
      name: req.body.name, 
      description: req.body.description, 
      location: req.body.location, 
      position: req.body.position, 
    }
  });
  res.send("update");
}

export async function test(req, res, next) {
  const r = req.params.delete;
  if(r){
    if(r === 'sensor'){
      await Sensor.deleteMany({});
    } else if(r === 'device'){
      await Device.deleteMany({});
    } else if(r === 'location'){
      await Location.deleteMany({});
    }
  }
  //await Sensor.deleteMany({});
  //res.send(await Device.find({}));
  res.send(await Sensor.find({}));
  //res.send(await Location.find({}));
}
