const { NekosiaAPI } = require('../index.js');

(async () => {
	const response = await NekosiaAPI.fetchImages({ session: 'ip', count: 1, tags: ['cute', 'blue-hair'], blacklist: ['yellow-hair'] });
	console.log(response);
})();