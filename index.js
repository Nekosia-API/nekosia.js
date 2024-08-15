const https = require('./services/https.js');
const categories = require('./categories.js');

class NekosiaAPI {
	constructor() {
		this.baseURL = 'https://api.nekosia.cat';
		this.initializeCategoryMethods();
	}

	initializeCategoryMethods() {
		categories.forEach(category => {
			const methodName = this.buildMethodName(category);
			this[methodName] = (options = {}) => this.fetchImagesByCategory(category, options);
		});
	}

	buildMethodName(category) {
		return `fetch${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, '')}Images`;
	}

	buildQueryParams(options) {
		return new URLSearchParams(Object.entries(options).filter(([, value]) => value != null && value !== '')).toString();
	}

	async makeHttpRequest(endpoint) {
		try {
			return await https.get(endpoint);
		} catch (err) {
			console.error(`HTTP request failed for endpoint ${endpoint}:`, err.message);
			throw err;
		}
	}

	fetchImagesByCategory(category, options = {}) {
		const finalOptions = {
			session: null,
			id: null,
			count: 1,
			additionalTags: '',
			blacklistedTags: '',
			...options
		};
		const queryString = this.buildQueryParams(finalOptions);
		const endpoint = `${this.baseURL}/api/v1/images/${category}?${queryString}`;
		return this.makeHttpRequest(endpoint);
	}

	async fetchShadowImages(additionalTagsArray = [], options = {}) {
		if (!additionalTagsArray.length) {
			throw new Error('additionalTagsArray must be a non-empty array for the shadow category.');
		}
		const additionalTags = additionalTagsArray.join(',');
		return this.fetchImagesByCategory('shadow', { ...options, additionalTags });
	}

	async fetchById(id) {
		if (!id) throw new Error('id parameter is required.');

		const endpoint = `${this.baseURL}/api/v1/getImageById/${id}`;
		return this.makeHttpRequest(endpoint);
	}
}

module.exports = new NekosiaAPI();