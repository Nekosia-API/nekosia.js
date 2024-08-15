const NekosiaAPI = require('../index.js');

const fetchImages = async (category, options = {}) => {
	try {
		const methodName = `get${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, '')}`;
		if (typeof NekosiaAPI[methodName] !== 'function') {
			throw new Error(`Method ${methodName} does not exist on NekosiaAPI`);
		}

		const images = await NekosiaAPI[methodName](options);
		console.log(`${category.toUpperCase()}:`, images);
	} catch (err) {
		console.error(`Error fetching ${category} images:`, err);
	}
};

(async () => {
	await fetchImages('catgirl');
	await fetchImages('foxgirl', { session: 'id', id: 'user123', count: 2 });
})();