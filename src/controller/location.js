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
    "_id name value occupation"
  );
  res.send(locations);
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
    res.send({ _id, name, occupation, value });
  } catch (err) {
    res.send({ error: err.message });
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
  res.send({ status: "deletado", location: location });
}

export async function detailDevice(req, res) {
  const { id: location_id } = req.params;
  const devices = await Device.find(
    {
      location: { $eq: location_id },
      status: { $gte: 0 },
      position: { $ne: null }
    },
    "_id name sensorData"
  )
    .populate({
      path: "sensorData",
      match: {
        location: { $eq: location_id }
      },
      select: "-_id value createAt",
      options: {
        sort: { createAt: -1 },
        limit: 1
      }
    })
    .sort([["name", "-1"]])
    .exec();

  if (devices.some(device => device.sensorData.length)) {
    let sensorData = devices
      .filter(device => device.sensorData.length)
      .map(device => device.sensorData[0].value);

    let count = sensorData.length;
    let sum = sensorData.reduce((a, s) => s + a, 0);
    let avg = count && Math.round(sum / count);
    let max = Math.max(...sensorData, 0) - avg;

    return res.json({
      _id: location_id,
      max,
      avg,
      devices
    });
  }

  return res.json({});
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
    .map(location => ({
      _id: location._id,
      name: location.name,
      max: location.device.reduce(
        (max, device) => max + device.sensorData[0].value,
        0
      ),
      avg: location.device.reduce((avg, device, deviceIndex, devices) => {
        if (devices.length === deviceIndex + 1) {
          return (avg + device.sensorData[0].value) / devices.length;
        }

        return avg + device.sensorData[0].value;
      }, 0)
    }));

  return res.json(locations);
}
