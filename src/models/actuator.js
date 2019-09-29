import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const actuators = new Schema({
  ["type"]: {
    type: String,
    enum: ['INFLATOR', 'GENERATOR'],
    required: true
  },
  name: {
    type: String,
    unique: true,
    required: true
  },
  value: {
    type: Boolean,
    default: false
  },
  description: String,
  updateAt: [{
    time: { type: Date, default: Date.now },
    value: Boolean
  }],
  createAt: {
    type: Date,
    default: Date.now
  }
});


export default model("actuator", actuators);
