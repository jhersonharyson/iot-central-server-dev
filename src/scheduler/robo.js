const {jwtBuilder} = require('../security/jwtBuilder');
const axios = require('axios');

const ativado = true;
const time = 5000;

const mac_list = [
	'3C:71:BF:F1:1D:A0',
	'3C:71:BF:F1:18:10'
]

module.exports = setInterval(async () => {

	if(ativado)
		mac_list.map( mac => {
			const token = jwtBuilder({ id: mac })
			axios.post("http://localhost:3001/api/v1/ws/sensors",{
				"token": "Bearer " + token,
				"sensorData" : [
					{"type" : "co2", "value" : Math.floor(Math.random() * 500) + 1}	
				]
			})
		})
}, time);
