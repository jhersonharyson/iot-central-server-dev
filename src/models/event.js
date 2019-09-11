import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const events = new Schema({
  ["type"]: String,
  description: String,
  sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("event", events);
