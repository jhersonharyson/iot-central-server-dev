import { MAC_ISINVALID } from "../exceptions/deviceException";
import Iot, { find } from "../models/iot";
import { jwtBuilder } from "../security/jwtBuilder";
const constants = global.constants;

export async function post(req, res) {
  try {
    const { token, sensorData } = req.body;


    const sensorId = req.userId;
    if(sensorId){

      const iot = new Iot({
        sensorId,
        sensorData
      });

      //await iot.save();
      console.log(iot);
      res.send({ status: "ok", token: jwtBuilder({ id: sensorId }) });
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
