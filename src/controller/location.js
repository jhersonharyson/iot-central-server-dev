import {
  MAC_ISINVALID,
  MAC_EXIST,
  MAC_ISNOTFOUND,
  NAMED_ISINVALID,
  DESCRIPTION_ISEMPTY,
  LOCATION_ISINVALID,
  POSITION_ISINVALID,
  ACCOUNT_ALREADY_EXISTS
} from "../exceptions/deviceException";

import { UNEXPECTED_ERROR } from "../exceptions/serverException";

import Location from "../models/location";
import Device from "../models/device";

export async function getAllLocations(req, res) {
  const locations = await Location.find({ status: { $ne: -1 } }).populate({
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
    return res.status(400).send({ NAMED_ISINVALID });

  if (!description || description == "")
    return res.status(400).send({ DESCRIPTION_ISEMPTY });

  const alreadyExists = await Location.find({ name, description });
  console.log(alreadyExists.length);
  if (alreadyExists.length) return res.status(200).send({ error: "error" });

  try {
    const location = await Location.create({
      name,
      description,
      img_url
    });
    console.log(location);
    res.send(location);
  } catch (e) {
    console.log(e);
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

export async function updateLocation(req, res) {
  const { name, description, img_url, _id } = req.body;

  const location = await Location.findOneAndUpdate(
    { _id: _id },
    { useFindAndModify: true }
  );

  if (!location) {
    return res.status(400).send(LOCATION_ISINVALID);
  }

  if (name) {
    if (name.length < 3 || name.length > 80)
      return res.status(400).send(NAMED_ISINVALID);
    location.name = name;
  }

  if (description) {
    location.description = description;
  }

  if (img_url) {
    location.img_url = img_url;
  }

  try {
    await location.save();
    req.io.emit("updateLocation", location);
    console.log(location);
    res.send(location);
  } catch (e) {
    return res.status(400).send(UNEXPECTED_ERROR);
  }
}

export async function getOccupation(req, res) {
  const locations = await Location.find(
    { status: { $eq: 1 } },
    "_id name value"
  );
  return res.send(locations);
}

export async function showLocation(req, res) {
  const location = await Location.findById(req.params.id);
  return res.send({ location });
}

export async function updateOccupation(req, res) {
  try {
    const loc = await Location.findOneAndUpdate(
      { _id: req.params.id },
      { useAndModify: true }
    );
    const { value } = req.body;
    loc.value = value;
    loc.occupation.push({ value });
    await loc.save();

    const { _id, name, occupation } = loc;

    req.io.emit("updateLocation", { _id, name, occupation, value });
    return res.send({ _id, name, occupation, value });
  } catch (err) {
    return res.send({ error: err.message });
    console.log(err);
  }
}

export async function deleteLocation(req, res) {
  const { location } = req.body;
  if (!(await Location.findById(location))) {
    return res.send(LOCATION_ISINVALID);
  }

  await Location.updateOne(
    { _id: location },
    {
      $set: { status: -1 }
    }
  );

  req.io.emit("deleteLocation", location);
  return res.send({ status: "deletado", location: location });
}

export async function detailDevice(req, res) {
  const { id: location_id } = req.params;

  var d = new Date();
  d.setDate(d.getDate() - 2);

  const devices = await Device.find(
    {
      location: { $eq: location_id },
      status: { $eq: 1 },
      position: { $ne: null }
    },
    "_id name sensorData"
  )
    .populate({
      path: "sensorData",
      match: {
        location: { $eq: location_id },
        createAt: { $gte: d }
      },
      select: "-_id value createAt",
      options: {
        sort: { createAt: -1 },
      }
    })
    .sort([["name", "-1"]])
    .exec();
  return res.json({ devices });
}

export async function dashboardLocation(req, res) {
  let locations = (await Location.find(
    {
      status: { $eq: 1 }
    },
    "_id name"
  ).populate({
    path: "device",
    match: {
      status: { $eq: 1 }
    },
    select: "_id",
    populate: {
      path: "sensorData",
      select: "value",
      options: {
        sort: { createAt: -1 },
        limit: 1
      }
    }
  }))
    .filter(
      location =>
        location.device.length &&
        location.device.some(device => device.sensorData.length)
    )
    .map(location => {
      let avg = location.device.reduce((avg, device, deviceIndex, devices) => {
        if (devices.length === deviceIndex + 1) {
          return (avg + device.sensorData[0].value) / devices.length;
        }

        return avg + device.sensorData[0].value;
      }, 0);

      let max = location.device.reduce(
        (max, device) => device.sensorData[0].value > max ? device.sensorData[0].value : max,
        0
      );

      return {
        _id: location._id,
        name: location.name,
        max: avg - max,
        avg
      };
    });

  return res.json(locations);
}
