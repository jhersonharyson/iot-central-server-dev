import Setting from "../models/setting";

export async function postSetting(req, res) {
	const { name, value, description } = req.body;

	if(name && value) {
		try {
			const setting = await new Setting({
				name,
				value,
				description
			}).save();
	
			return res.status(201).json(setting);
		} catch (e) {
			//console.log(e);
			return res.status(400).send("UNEXPECTED_ERROR");
		}
	} else {
		return res.send("UNEXPECTED_ERROR");
	}

}

export async function getSetting(req, res, next) {
	const name = req.params.name;
	res.send(await Setting.find((name) ? {name} : {}))//.sort([["data", "descending"]]););
}

export async function updateSetting(req, res, next) {
	const up = await Setting.findOneAndUpdate({name: req.params.name}, 
        {$set : {
          value: req.body.value, 
          description: req.body.description, 
        }
      }, { useFindAndModify: false, new: true });
    res.send(up);
}

export async function deleteSetting(req, res, next) {
	res.send(await Setting.deleteOne({name: req.params.name}));
}