import Setting from "../models/setting";

export async function postSetting(req, res) {
	const { variable, value, description } = req.body;

	try {
		const setting = await new Setting({
			variable,
			value,
			description
		}).save();

		return res.status(201).json(setting);
	} catch (e) {
		//console.log(e);
		return res.status(400).send("UNEXPECTED_ERROR");
	}
}

export async function getSetting(req, res, next) {
	const name = req.params.name;
	res.send(await Setting.find((name) ? {variable: name} : {}))//.sort([["data", "descending"]]););
}

export async function updateSetting(req, res, next) {
	const up = await Setting.updateOne({variable: req.params.name}, 
        {$set : {
			variable: req.body.type, 
          	value: req.body.value, 
          	description: req.body.description, 
        }
      });
    res.send(up);
}

export async function deleteSetting(req, res, next) {
	res.send(await Setting.deleteOne({variable: req.params.name}));
}