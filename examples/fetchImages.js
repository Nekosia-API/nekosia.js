const { NekosiaAPI } = require('../index.js');

(async () => {
	const response = await NekosiaAPI.fetchImages({
		session: 'ip',
		count: 1,
		tags: ['cute', 'sakura', 'blue-hair', 'blue-eyes'],
		blacklist: ['beret', 'hat'],
	});

	console.log(response);
})();