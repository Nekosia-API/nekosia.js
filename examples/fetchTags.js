const { NekosiaAPI } = require('../index.js');

(async () => {
	const json = await NekosiaAPI.fetchTags();
	console.log(json);
})();