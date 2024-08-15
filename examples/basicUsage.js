const NekosiaAPI = require('../index.js');

(async () => {
	const json = await NekosiaAPI.fetchFoxgirlImages({ session: 'ip', count: 1, additionalTags: ['cute', 'sakura', 'cherry-blossom'], blacklistedTags: ['beret'] });
	console.log(json);
})();