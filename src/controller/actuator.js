import Actuator from "../models/actuator";

export async function postActuator(req, res) {
	const { type, value, description } = req.body;

	try {
		const actuator = await new Actuator({
			type,
			value,
			description
		}).save();

		return res.status(201).json(actuator);
	} catch (e) {
		//console.log(e);
		return res.status(400).send("UNEXPECTED_ERROR");
	}
}

export async function getActuator(req, res, next) {
	const name = req.params.name;
	res.send(await Actuator.find((name) ? {type: name} : {}))//.sort([["data", "descending"]]););
}