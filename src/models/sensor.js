import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const sensors = new Schema({
  sensorId: { type: Schema.Types.ObjectId, ref: "device" },
  ["type"]: String,
  value: Number,
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("sensor", sensors);
