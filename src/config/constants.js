export const BASE_URL = process.env.BASE_URL || "/api/v1/ws/";
export const mongoDB =
  process.env.MONGO_URL ||
  "mongodb://big-city-42:big-city-42@ds251598.mlab.com:51598/big-city";

export default { BASE_URL, mongoDB };
