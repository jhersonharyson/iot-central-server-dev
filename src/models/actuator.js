import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const actuators = new Schema({
  ["type"]: {
    type: String,
    enum: ["inflator", "generator"],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  description: String,
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("actuator", actuators);
