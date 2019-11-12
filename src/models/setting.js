import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const settings = new Schema({
  name: String,
  value: String,
  description: String
});

export default model("setting", settings);
