import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const locations = new Schema({
  name: String,
  description: String,
  img_url: String,
  position: { x: { type: Number }, y: { type: Number } },
  createAt: {
    type: String,
    default: Date.now()
  },
  device: [{ type: Schema.Types.ObjectId, ref: "device" }]
});

export default model("location", locations);
