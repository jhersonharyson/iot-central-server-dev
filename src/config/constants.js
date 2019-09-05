export const BASE_URL = process.env.BASE_URL || "/api/v1/ws/";
export const mongoDB =
  process.env.MONGO_URL ||
  "mongodb://iot-central:iot-central123@ds217678.mlab.com:17678/iot-central";

export default { BASE_URL, mongoDB };
