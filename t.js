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

(async () => {
  model("location", locations);
  model("sensor", sensors);
  model("device", devices);

  arr = [
    { d: "5d7b2a0c4f457439281f11ff", l: "5d7a22abd6a58d01633ddb53" },
    { d: "5d7b2acdefbd4f2e8cef86d3", l: "5d7a22abd6a58d01633ddb53" },
    { d: "5d7b2aeb9107e71728bf81c9", l: "5d7a22cd56acba01781fe682" },
    { d: "5d7ac6ba9a5fef0ca4ba0c31", l: "5d7a22abd6a58d01633ddb53" }
  ];

  for (let i = 0; i < 100; i++)
    await arr.forEach(async x => {
      const s = await model("sensor", sensors).create({
        deviceId: x.d,
        ["type"]: "CO2",
        value: Math.floor(Math.random() * 1000) + 100,
        location: x.l,
        position: {
          x: Math.floor(Math.random() * 30) + 0,
          y: Math.floor(Math.random() * 30) + 0
        },
        teste: 1
      });

      const d = await model("device", devices).findByIdAndUpdate(x.d, {
        $push: { sensorData: s._id }
      });
    });

  const dev = await model("device", devices)
    .find({})
    .populate("sensor");
  console.log(dev);
})();
