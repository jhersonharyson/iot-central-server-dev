const path = require('path');
const { readdirSync } = require('fs');

module.exports = (app) => {
	 readdirSync(path.join(__dirname))
		.filter( fileName => (fileName !== 'index.js'))
		.forEach(fileName => {
			require(path.join(__dirname, path.basename(fileName)));
		}); 
};
