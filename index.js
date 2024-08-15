const https = require('./services/https.js');
const categories = require('./categories.js');

class NekosiaAPI {
	constructor() {
		this.baseURL = 'https://api.nekosia.cat/api/v1';
		this.initializeCategoryMethods();
	}

	initializeCategoryMethods() {
		categories.forEach(category => {
			this[this.buildMethodName(category)] = options => this.fetchImagesByCategory(category, options);
		});
	}

	buildMethodName(category) {
		return `fetch${category.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase()).replace(/\s/g, '')}Images`;
	}

	buildQueryParams(options = {}) {
		return Object.entries(options)
			.filter(([, value]) => value != null && value !== '' && (!Array.isArray(value) || value.length))
			.map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
			.join('&');
	}

	async makeHttpRequest(endpoint) {
		try {
			return await https.get(endpoint);
		} catch (err) {
			console.error(`HTTP request failed for endpoint ${endpoint}: ${err.message}`);
			throw err;
		}
	}

	fetchImagesByCategory(category, options = {}) {
		const queryString = this.buildQueryParams({
			session: null,
			id: null,
			count: 1,
			additionalTags: [],
			blacklistedTags: [],
			...options
		});
		return this.makeHttpRequest(`${this.baseURL}/images/${category}?${queryString}`);
	}

	async fetchShadowImages(additionalTagsArray = [], options = {}) {
		if (!additionalTagsArray.length) {
			throw new Error('`additionalTagsArray` must be a non-empty array for the shadow category');
		}

		return this.fetchImagesByCategory('shadow', {
			...options,
			additionalTags: additionalTagsArray.join(',')
		});
	}

	async fetchById(id) {
		if (!id) throw new Error('`id` parameter is required');

		return this.makeHttpRequest(`${this.baseURL}/getImageById/${id}`);
	}
}

module.exports = new NekosiaAPI();