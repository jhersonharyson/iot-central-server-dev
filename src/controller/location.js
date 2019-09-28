import Location from "../models/location";

export async function getAllLocations(req, res) {
  const locations = await Location.find({}).populate({
    path: "device",
    select: "-sensorData"
  });
  res.send({ locations });
}

export async function postLocation(req, res) {
  const { name, description } = req.body;

  //if (!name) res.send("error");

  console.log(req.file.filename);
  res.send("ok");

  // await Location.create({
  //   name,
  //   description
  // });
}
