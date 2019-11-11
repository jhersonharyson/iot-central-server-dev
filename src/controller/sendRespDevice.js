import Setting from "../models/setting";
import { jwtBuilder } from "../security/jwtBuilder";

export default async function sendRespDevice(mac) {
	
	let sett = await Setting.find({});
			
	const resp = { token: jwtBuilder({ id: mac }) };

	sett.map( arr => {
		if(['sendTime','timeSleep','statusMode'].includes(arr.name)){
		resp[arr.name] = arr.value ;
		};
	})

	return resp;

} 