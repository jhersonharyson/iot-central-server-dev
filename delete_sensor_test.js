const { Schema, connect, model } = require("mongoose");

connect(
  "mongodb://iot-central:iot-central123@ds217678.mlab.com:17678/iot-central",
  { useNewUrlParser: true, useCreateIndex: true }
);

const devices = new Schema({
  mac: { type: String, required: true, minlength: 17, maxlength: 17 },
  name: String,
  description: String,
  sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
  location: { type: Schema.Types.ObjectId, ref: "location" },
  position: { x: { type: Number }, y: { type: Number } },
  createAt: {
    type: Date,
    default: Date.now
  }
});

const locations = new Schema({
  name: String,
  description: String,
  img_url: String,
  device: [{ type: Schema.Types.ObjectId, ref: "device" }],
  createAt: {
    type: Date,
    default: Date.now
  }
});

const sensors = new Schema({
  deviceId: { type: Schema.Types.ObjectId, ref: "device" },
  ["type"]: String,
  value: Number,
  location: { type: Schema.Types.ObjectId, ref: "location" },
  position: { x: { type: Number }, y: { type: Number } },
  createAt: {
    type: Date,
    default: Date.now
  }
});

model("location", locations);
model("sensor", sensors);
model("device", devices);
(async () => {
  const r = await model("sensor", sensors).deleteMany({
    deviceId: "5d7d16aee7179a084efd40b2"
  });
  console.log(r);
})();
