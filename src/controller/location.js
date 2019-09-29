import {
  MAC_ISINVALID,
  MAC_EXIST,
  MAC_ISNOTFOUND,
  NAMED_ISINVALID,
  DESCRIPTION_ISEMPTY,
  LOCATION_ISINVALID,
  POSITION_ISINVALID
} from "../exceptions/deviceException";

import { UNEXPECTED_ERROR } from "../exceptions/serverException";

import Location from "../models/location";

export async function getAllLocations(req, res) {
  const locations = await Location.find({}).populate({
    path: "device",
    select: "-sensorData"
  });
  res.send({ locations });
}

export async function postLocationWithFile(req, res) {
  const { name, description } = req.body;

  console.log(req.file.filename);
  res.send("ok");
}

export async function postLocation(req, res) {
  const { name, description, img_url } = req.body;
  if (!name || name == "" || name.length < 3 || name.length > 80)
    return res.status(400).send(NAMED_ISINVALID);
  if (!description || description == "")
    return res.status(400).send(DESCRIPTION_ISEMPTY);

  try {
    const location = await Location.create({
      name,
      description,
      img_url
    });
    console.log(location);
    res.send(location);
  } catch (e) {
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

export async function updateLocation(req, res) {
  const { name, description, img_url } = req.body;
  if (name) {
    if (name.length < 3 || name.length > 80)
      return res.status(400).send(NAMED_ISINVALID);
  }
  if (!description || description == "")
    return res.status(400).send(DESCRIPTION_ISEMPTY);

  try {
    const location = await Location.create({
      name,
      description,
      img_url
    });
    console.log(location);
    res.send(location);
  } catch (e) {
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}
