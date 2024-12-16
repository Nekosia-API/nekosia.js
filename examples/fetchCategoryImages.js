const { NekosiaAPI } = require('../index.js');

(async () => {
	const response = await NekosiaAPI.fetchCategoryImages('foxgirl', {
		session: 'ip',
		count: 1,
		additionalTags: ['cute', 'sakura', 'cherry-blossom'],
		blacklistedTags: ['beret'],
	});

	console.log(response);
})();