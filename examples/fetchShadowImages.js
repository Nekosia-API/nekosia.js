const NekosiaAPI = require('../index.js');

(async () => {
	const data = await NekosiaAPI.fetchShadowImages(['cute', 'blue-hair'], { session: 'ip', count: 1 });
	console.log(data);
})();
