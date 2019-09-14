import Location from "../models/location";

export async function getAllLocations(req, res) {
  const locations = await Location.find({}).populate({
    path: "device",
    select: "-sensorData"
  });
  res.send({ locations });
}
