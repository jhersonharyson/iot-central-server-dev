import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const devices = new Schema({
  mac: String,
  name: String,
  data: [{ value: Number, ["type"]: String }],
  createAt: {
    type: String,
    default: Date.now()
  }
});

export default model("device", devices);
