import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const actuators = new Schema({
  ["type"]: String,
  value: Boolean,
  description: String,
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default model("actuator", actuators);
