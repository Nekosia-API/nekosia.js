const { NekosiaAPI } = require('../index.js');

(async () => {
	const response = await NekosiaAPI.fetchShadowImages({ session: 'ip', count: 1, additionalTags: ['cute', 'blue-hair'] });
	console.log(response);
})();