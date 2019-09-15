import Actuator from "../models/actuator";

export async function postActuator(req, res) {
	const { type, value, description } = req.body;

	try {
		const actuator = await Actuator.create({
			type,
			value,
			description
		});

		req.io.emit("postActuator", actuator);
		return res.status(201).json(actuator);
	} catch (e) {
		//console.log(e);
		return res.status(400).send("UNEXPECTED_ERROR");
	}
}

export async function getActuator(req, res, next) {
	const type = req.params.name;

	res.send(
		await Actuator
			.find(type ? { type } : {})
			.sort([["createAt", "descending"]])
			.limit(1)
	);
}