const { Schema, connect, model } = require("mongoose");

connect(
  "mongodb://iot-central:iot-central123@ds217678.mlab.com:17678/iot-central",
  { useNewUrlParser: true, useCreateIndex: true }
);

const events = new Schema({
  ["type"]: String,
  description: String,
  sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
  createAt: {
    type: Date,
    default: Date.now
  }
});

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

const robot_data = async () => {
  model("location", locations);
  model("sensor", sensors);
  model("device", devices);
  model("event", events);

  arr = [{ d: "5d7d16aee7179a084efd40b2", l: "5d7d1628e7179a084efd40ac" }];

  // arrSensorId = [
  //   "5d7d198f4cc4a811fc3b8d78",
  //   "5d7d198f4cc4a811fc3b8d77",
  //   "5d7d198f4cc4a811fc3b8d76"
  // ];

  // for (let i = 0; i < 3; i++)
  await arr.forEach(async x => {
    const s = await model("sensor", sensors).create({
      deviceId: x.d,
      ["type"]: "CO2",
      value: Math.floor(Math.random() * 10000) + 6000,
      location: x.l,
      position: {
        x: 23,
        y: 23
      },
      teste: 2
    });

    const d = await model("device", devices).findByIdAndUpdate(x.d, {
      $push: { sensorData: s._id },
      $set: { teste: 2 }
    });

    if (s.value >= 4000) {
      const e = await model("event", events)
        .find({})
        .countDocuments();

      if (e == 0) {
        try {
          const evs = await model("event", events).create({
            type: s.type,
            description: `${new Date().toLocaleString()} - Nível de ${
              s.type
            } em ${s.value} ppm`,
            sensorData: [s._id]
          });
          console.log("craete");
        } catch (e) {
          console.log(e);
        }
      } else {
        const evs = await model("event", events).find({});
        const incidente = evs.find(e => {
          console.log(e.createAt.getTime() + " - " + Date.now());
          return e.createAt.getTime() + 10 * 1000 * 60 > Date.now() == true;
        });
        if (incidente) {
          incidente.sensorData.push(s._id);
          incidente.description = `${new Date().toLocaleString()} - Nível de ${
            s.type
          } em ${s.value} ppm`;
          incidente.save();
        } else {
          try {
            const evs = await model("event", events).create({
              type: s.type,
              description: `${new Date().toLocaleString()} - Nível de ${
                s.type
              } em ${s.value} ppm`,
              sensorData: [s._id]
            });
            console.log("craete");
          } catch (e) {
            console.log(e);
          }
        }
      }
    }
  });
};

//robot_data();
const remove = async () => {
  model("sensor", sensors);

  await model("sensor", sensors).create({
    _id: "5d7d2567e1461622505af98a",
    deviceId: "5d7d16aee7179a084efd40b2",
    type: "CO2",
    value: 9353,
    location: "5d7d1628e7179a084efd40ac",
    position: {
      x: 23,
      y: 23
    }
  });

  const d = await model("device", devices).findByIdAndUpdate(
    "5d7d16aee7179a084efd40b2",
    {
      $push: { sensorData: "5d7d2567e1461622505af98a" },
      $set: { teste: 2 }
    }
  );

  await setTimeout(() => {}, 10000);

  const sensor = await model("sensor", sensors).findByIdAndRemove({
    _id: "5d7d2567e1461622505af98a"
  });

  const device = await model("device", devices).findById(sensor.deviceId);
  device.sensorData.pull({ _id: sensor._id });
  device.save();
};
remove();
/*

// sensors
{
    "value": {
        "$gt": 6000
    }
}

{
    "_id": {
        "$oid": "5d7d2567e1461622505af98a"
    },
    "deviceId": {
        "$oid": "5d7d16aee7179a084efd40b2"
    },
    "type": "CO2",
    "value": 9353,
    "location": {
        "$oid": "5d7d1628e7179a084efd40ac"
    },
    "position": {
        "x": 23,
        "y": 23
    },
    "createAt": {
        "$date": "2019-09-14T16:47:11.605Z"
    },
    "__v": 0
}

*/
