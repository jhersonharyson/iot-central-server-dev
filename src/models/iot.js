const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const iot = new Schema({
  state: String,
  name: String,
  country: String,
  geolocation: {
    lat: Number,
    lon: Number,
    speed: Number
  },
  data: {
    type: Date,
    dafault: Date.now()
  },
  sensor: {
    temperature: Number,
    humidity: Number,
    noise_pollution: Number,
    toxic_gases: {
      co: Number,
      smoke: Number,
      lpg: Number
    }
  },
  current_weather: {
    temperature: Number,
    wind_direction: String,
    wind_velocity: Number,
    humidity: Number,
    condition: String,
    pressure: Number,
    icon: String,
    sensation_current: Number
  },
  flowSegmentData: {
    frc: String,
    currentSpeed: Number,
    freeFlowSpeed: Number,
    currentTravelTime: Number,
    freeFlowTravelTime: Number,
    confidence: Number
  }
});

module.exports = mongoose.model("iot", iot);
