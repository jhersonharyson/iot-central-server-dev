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
  const Location = model("location", locations);
  const Sensor = model("sensor", sensors);
  const Device = model("device", devices);
  let locationsR = undefined;
  let sensorsR = undefined;
  let devicesR = undefined;

  // await Promise.all([
  //   Location.find({}).then(loc => (locationsR = loc)),
  //   Sensor.find({}).then(sen => (sensorsR = sen)),
  //   Device.find({ status: 1 }).then(dev => (devicesR = dev))
  // ]);

  // locationsR.forEach(loc => {
  // loc.device.forEach(async dev => {
  let l = await Sensor.aggregate([
    {
      $group: {
        _id: "$location",
        max: { $max: "$value" },
        avg: { $avg: "$value" }
      }
    }
  ]);

  loc = await Promise.all(
    l.map(async data => {
      const { name } = await Location.findById(data._id, "name -_id");
      return { ...data, location_name: name };
    })
  );

  console.log(loc);
})();
