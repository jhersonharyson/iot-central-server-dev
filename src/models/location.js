import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const locations = new Schema({
  name: String,
  description: String,
  img_url: String,
  device: [{ type: Schema.Types.ObjectId, ref: "device", unique: true }],
  createAt: {
    type: Date,
    default: Date.now
  }
});

export default model("location", locations);
