const { NekosiaAPI } = require('../index.js');

const fetchImages = async (category, options = {}) => {
	try {
		const response = await NekosiaAPI.fetchCategoryImages(category, options);
		console.log(`${category.toUpperCase()}:`, response);
	} catch (err) {
		console.error(`Error fetching ${category} images:`, err);
	}
};

(async () => {
	await fetchImages('catgirl');
	await fetchImages('foxgirl', { session: 'id', id: 'user123', count: 2 });
	await fetchImages('catgirl', { tags: 'animal-ears' });
})();