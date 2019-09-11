import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const sensors = new Schema({
  deviceId: { type: Schema.Types.ObjectId, ref: "device" },
  ["type"]: String,
  value: Number,
  location: { type: Schema.Types.ObjectId, ref: "location" },
  position: { x: { type: Number }, y: { type: Number } },
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("sensor", sensors);
