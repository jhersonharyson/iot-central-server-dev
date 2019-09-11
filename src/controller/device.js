import { MAC_ISINVALID } from "../exceptions/deviceException";
import Device from "../models/device";
import Location from "../models/location";
import Sensor from "../models/sensor";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function post(req, res) {
  try {
    const { token, deviceData } = req.body;

    
    const mac = req.userId;
    const device = await Device.findOne({ mac: mac });
    
    
    //console.log(deviceData);

    const deviceId = device._id;
    const location = device.location;
    const position = device.position;

    if(mac){

      try{

        deviceData.map(function(arr){
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

export async function get(req, res, next) {
  const mac = req.params.mac;
  res.send(await Device.find((mac) ? {mac: mac} : {}).populate({
    path: 'sensorData',
    model: 'sensor',
    select: 'type value createAt -_id',
  }).populate({ 
    path: 'location', 
    select: 'name description -_id' 
  }))//.sort([["data", "descending"]]););
}

export async function test(req, res, next) {
  //console.log(await Device.find({}));
  //console.log(await Sensor.find({}));
  //console.log(await Location.find({}));
  res.send(await Sensor.find({}));
}
