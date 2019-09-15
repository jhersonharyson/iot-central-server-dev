const { Schema, connect, model } = require("mongoose");
const axios = require("axios");

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
  status: {
    type: Number,
    default: 0
  },
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
  },
  test: {
    type: Boolean,
    default: true
  }
});

(async () => {
  model("location", locations);
  model("sensor", sensors);
  model("device", devices);

  const device_attr = [
    { d: "5d7b2a0c4f457439281f11ff", l: "5d7a22abd6a58d01633ddb53" },
    { d: "5d7b2acdefbd4f2e8cef86d3", l: "5d7a22abd6a58d01633ddb53" },
    { d: "5d7b2aeb9107e71728bf81c9", l: "5d7a22cd56acba01781fe682" },
    { d: "5d7ac6ba9a5fef0ca4ba0c31", l: "5d7a22abd6a58d01633ddb53" }
  ];

  const device = await model("device", devices).deleteMany({
    _id: {
      $in: [
        "5d7b2a0c4f457439281f11ff",
        "5d7b2acdefbd4f2e8cef86d3",
        "5d7b2aeb9107e71728bf81c9",
        "5d7ac6ba9a5fef0ca4ba0c31"
      ]
    }
  });
  console.log("deletando dispositivos");

  const sensor = await model("sensor", sensors).deleteMany({
    //deleteMany({
    deviceId: {
      $in: [
        "5d7b2a0c4f457439281f11ff",
        "5d7b2acdefbd4f2e8cef86d3",
        "5d7b2aeb9107e71728bf81c9",
        "5d7ac6ba9a5fef0ca4ba0c31"
      ]
    }
    // {
    //   $lte: new Date(
    //     new Date("2019-09-14T07:19:43.611Z").getTime() + 60 * 1000 * 5
    //   ),
    //   $gte: new Date("2019-09-14T07:19:43.611Z").getTime() - 60 * 1000 * 5
    // }
  });
  console.log("deletando sensores");

  await Promise.all([
    device_attr.forEach(async (dev, i) => {
      await model("device", devices).create({
        _id: dev.d,
        location: dev.l,
        sensorData: [],
        status: 1,
        mac: "18:FE:34:F2:EC:" + ["AA", "CC", "TT", "FF"][i],
        name: "ESP " + ["AA", "CC", "DD", "FF"][i],
        description: "Dispositivo Teste ESP " + ["AA", "CC", "TT", "FF"][i],
        position: {
          x: 999,
          y: 999
        }
      });
      console.log("criando dispositvo => ", dev.d);
    })
  ]);

  //   const device = await model("device", devices).find({
  //     _id: {
  //       $in: [
  //         "5d7b2a0c4f457439281f11ff",
  //         "5d7b2acdefbd4f2e8cef86d3",
  //         "5d7b2aeb9107e71728bf81c9",
  //         "5d7ac6ba9a5fef0ca4ba0c31"
  //       ]
  //     }
  //   });

  //   device.forEach((d, iDevice) => {
  //     sensor.forEach(s => {
  //       console.log("Device " + iDevice);
  //       console.log(d.sensorData.length);
  //       console.log(d.sensorData.pull(s).length);
  //       console.log("\n");
  //     });
  //     d.save();
  //   });

  //   device.forEach((d, iDevice) => {
  //     console.log("Device Final " + iDevice);
  //     console.log(d.sensorData.length);
  //   });
})();
