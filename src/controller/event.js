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

export async function getEvent(req, res, next) {
	const name = req.params.name;
	res.send(await Event.find((name) ? {type: name} : {}))//.sort([["data", "descending"]]););
}