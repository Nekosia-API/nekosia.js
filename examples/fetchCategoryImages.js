import { NekosiaAPI } from '../index.js';

(async () => {
	const response = await NekosiaAPI.fetchCategoryImages('foxgirl', {
		session: 'ip',
		count: 1,
		additionalTags: ['cute', 'sakura', 'blue-hair', 'blue-eyes'],
		blacklistedTags: ['beret', 'hat'],
	});

	console.log(response);
})();
