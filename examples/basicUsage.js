const NekosiaAPI = require('../index.js');

(async () => {
	const json = await NekosiaAPI.fetchCatgirlImages();
	console.log(json);
})();