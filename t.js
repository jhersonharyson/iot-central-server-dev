const {Schema, connect, model} = require('mongoose')



connect("mongodb://iot-central:iot-central123@ds217678.mlab.com:17678/iot-central",
    { useNewUrlParser: true, useCreateIndex: true }
)


const devices = new Schema({
    mac: { type: String, required: true, minlength: 17, maxlength: 17 },
    name: String,
    description: String,
    sensorData: [{ type: Schema.Types.ObjectId, ref: "sensor" }],
    location: { type: Schema.Types.ObjectId, ref: "location" },
    position: { x: { type: Number }, y: { type: Number } },
    createAt: {
      type: String,
      default: Date.now()
    }
  });
  

  
const locations = new Schema({
    name: String,
    description: String,
    img_url: String,
    device: [{ type: Schema.Types.ObjectId, ref: "device" }],
    createAt: {
      type: String,
      default: Date.now()
    }
  });
  
  const sensors = new Schema({
    deviceId: { type: Schema.Types.ObjectId, ref: "device" },
    ["type"]: String,
    value: Number,
    location: { type: Schema.Types.ObjectId, ref: "location" },
    position: { x: { type: Number }, y: { type: Number } },
    createAt: {
      type: String,
      default: Date.now()
    }
  });
  
  

(async ()=>{
    model("location", locations);
    model("sensor", sensors);
    const dev = await model("device", devices).find({}).populate('sensor')
    console.log(dev);
    

})()