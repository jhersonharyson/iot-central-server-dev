import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const devices = new Schema({
  sensorId: { type: String, required: true, minlength: 17, maxlength: 17 },
  name: String,
  description: String,
  sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
  location: { type: Schema.Types.ObjectId, ref: "location" },
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("device", devices);
