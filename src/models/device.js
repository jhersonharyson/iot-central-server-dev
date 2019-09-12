import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const devices = new Schema({
  mac: { type: String, required: true, minlength: 17, maxlength: 17 },
  name: String,
  description: String,
  sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
  location: { type: Schema.Types.ObjectId, ref: "location" },
  position: { x: { type: Number }, y: { type: Number } },
  status: {
    type: Number,
    default: 0 //[-1] - disabled/deleted, [0] - no connected, [1] - connected
  },
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("device", devices);
