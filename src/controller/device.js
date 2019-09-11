import { MAC_ISINVALID } from "../exceptions/deviceException";
import Device from "../models/device";
import Sensor from "../models/sensor";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function post(req, res) {
  try {
    const { token, sensorData } = req.body;

    //console.log(sensorData);

    const deviceId = req.userId;
    if(deviceId){
      sensorData.map(function(arr){
        let type = arr.type;
        let value = arr.value;
        const sensor = new Sensor({
          deviceId,
          type,
          value
        });
        //await iot.save();
        console.log(sensor);
      });
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
  const data = await find({}).sort([["data", "descending"]]);
  res.send(data);
}

export async function test(req, res, next) {
  console.log("ok");
  res.send({ ok: "ok" });
}
