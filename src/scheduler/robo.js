import { jwtBuilder } from "../security/jwtBuilder";
import axios from "axios";

const time = 5000;
const enabled = !true;

const mac_list = ["3C:71:BF:F1:1D:A0"];

export default context =>
  setInterval(async () => {
    if (process.env.NODE_ENV !== "production" && enabled)
      mac_list.map(mac => {
        const token = jwtBuilder({ id: mac });
        axios.post("http://localhost:3001/api/v1/ws/sensors", {
          token: "Bearer " + token,
          sensorData: [
            { type: "co2", value: Math.floor(Math.random() * 500) + 1 }
          ]
        });
      });
  }, time);
