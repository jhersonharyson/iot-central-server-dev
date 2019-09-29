import Actuator from "../models/actuator";

export async function postActuator(req, res) {
	const { type, value, description, name } = req.body;

	try {
		const actuator = await Actuator.create({
			type,
			value,
			name,
			description
		});

		req.io.emit("postActuator", actuator);
		return res.status(201).json(actuator);
	} catch (e) {
		return res.status(400).send("UNEXPECTED_ERROR");
	}
}

export async function getActuator(req, res, next) {
	const type = req.params.name;

	res.send(
		await Actuator
			.find(type ? { type } : {})
			.sort([["createAt", "descending"]])
	);
}

export async function updateActuator(req, res) {
	try {
		const inf = await Actuator.findOneAndUpdate({ _id: req.params.id }, { useAndModify: true });
		const { value } = req.body;
		inf.value = value;
		inf.updateAt.push({ value });
		await inf.save();

		req.io.emit('updateActuator', inf);
		res.send(inf);
	} catch (err) {
		res.send({ error: err.message });
		console.log(err);
	};
}


export async function deleteActuator(req, res) {
	const id = req.params.id;
	//await Actuator.deleteMany({}); //apagar a base
	await Actuator.deleteOne(
		{ _id: id }
	).then(arr => {
		if (arr.n) {
			res.send({ status: 'ok' });
		} else {
			res.send({ status: 'error' });
		}
	}).catch(err => {
		res.send({ error: err.message });
	});
}