import { NekosiaAPI } from '../index.js';

const fetch = async (category, options = {}) => {
	try {
		const response = await NekosiaAPI.fetchCategoryImages(category, options);
		console.log(`${category.toUpperCase()}:`, response);
	} catch (err) {
		console.error(`Error fetching ${category} images:`, err);
	}
};

(async () => {
	await fetch('catgirl');
	await fetch('foxgirl', { session: 'id', id: 'user123', count: 2 });
	await fetch('catgirl', { tags: 'animal-ears' });
})();
