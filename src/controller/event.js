import Event from "../models/event";

export async function postEvent(req, res) {
  const { type, description, sensorId } = req.body;

  try {
    const Event = await new Event({
      type,
      description,
      sensorId
    }).save();

    return res.status(201).json(Event);
  } catch (e) {
    //console.log(e);
    return res.status(400).send("UNEXPECTED_ERROR");
  }
}

export async function getEventByInterval(req, res) {
  const interval = req.params.interval || Date.now() - 60 * 1000 * 60 * 24;
  const minDate = new Date(parseInt(interval));
  const events_counter = await Event.find({
    createAt: { $gte: minDate }
  }).countDocuments();

  console.log(events_counter);
  res.send({ events_counter: parseInt(events_counter) }); //.sort([["data", "descending"]]););
}

export async function getEvent(req, res, next) {
  const name = req.params.name;
  res.send(await Event.find(name ? { type: name } : {})); //.sort([["data", "descending"]]););
}

export async function removeEvent(req, res) {
  const id = req.params.id;
  const event = await Event.findByIdAndDelete(id);
  res.send({ event, status: "deleted" });
}

export async function getAllEvents(req, res) {
  const events = await Event.find({})
    .populate({
      path: "sensorData",
      populate: [
        {
          path: "location",
          select: "-device -img_url -status -occupation"
        },
        {
          path: "deviceId",
          select: "mac _id name description"
        }
      ]
    })
    .sort([["createAt", "descending"]]);

  res.send({ events });
}
