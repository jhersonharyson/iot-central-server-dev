const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iot = new Schema({
  sensorId: String,
  sensorData: [{
    _id: false,
    typ: String,
    val: Number
  }],
  data: {
    type: Date,
    default: Date.now()
  }
});


module.exports = mongoose.model("iot", iot);
