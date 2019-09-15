import Location from "../models/location";

export async function postLocation(req, res) { //Não sei como vai funcionar
	const { name, description, img_url, device } = req.body;

	try {
		const location = await new Location({
			name,
            description,
            img_url,
			device
		}).save();

		return res.status(201).json(location);
	} catch (e) {
		//console.log(e);
		return res.status(400).send("UNEXPECTED_ERROR");
	}
}

export async function getLocation(req, res, next) {
	const name = req.params.name;
	res.send(await Location.find((name) ? {name: {'$regex': name, '$options': 'i'}} : {}).select('-device'));
}


export async function getLocationDevices(req, res, next) {
	const name = req.params.name;
	res.send(await Location.find((name) ? {name: {'$regex': name, '$options': 'i'}} : {}).populate({
		path: "device",
		select: "-sensorData"
	}));
}

export async function updateLocation(req, res, next) {  //Não sei como vai funcionar
	const up = await Location.updateOne({name: req.params.name}, 
        {
            $set : {
			    name: req.body.type, 
                description: req.body.description, 
          	    img_url: req.body.value, 
            }
        }
    );
    res.send(await Location.find({name: req.params.name}));
}

export async function deleteLocation(req, res, next) {
	res.send(await Location.deleteOne({name: req.params.name}));
}

