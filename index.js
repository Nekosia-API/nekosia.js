const https = require('./services/https.js');
const categories = require('./categories.js');

class NekosiaAPI {
	constructor() {
		this.baseURL = 'https://api.nekosia.cat';
		this.initializeCategoryMethods();
	}

	initializeCategoryMethods() {
		categories.forEach(category => {
			const methodName = `fetch${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, '')}Images`;
			this[methodName] = (options = {}) => this.fetchImagesByCategory(category, options);
		});
	}

	buildQueryParams(options) {
		const params = new URLSearchParams();
		Object.entries(options).forEach(([key, value]) => {
			if (value !== null && value !== undefined && value !== '') {
				params.append(key, value);
			}
		});
		return params.toString();
	}

	async makeHttpRequest(category, options) {
		const queryString = this.buildQueryParams(options);
		const endpoint = `${this.baseURL}/api/v1/images/${category}?${queryString}`;
		try {
			const response = await https.get(endpoint);
			return response.data || response; // Assuming https.get returns a response object with data property
		} catch (error) {
			console.error(`Error fetching images for category ${category}:`, error.message);
			throw error;
		}
	}

	async fetchImagesByCategory(category, options = {}) {
		const defaultOptions = {
			session: null,
			id: null,
			count: 1,
			additionalTags: '',
			blacklistedTags: ''
		};
		const finalOptions = { ...defaultOptions, ...options };
		return this.makeHttpRequest(category, finalOptions);
	}

	async fetchShadowImages(additionalTagsArray = [], options = {}) {
		if (!Array.isArray(additionalTagsArray) || additionalTagsArray.length === 0) {
			throw new Error('additionalTagsArray parameter is required and must be a non-empty array for the shadow category.');
		}

		const additionalTags = additionalTagsArray.join(',');
		return this.fetchImagesByCategory('shadow', { ...options, additionalTags });
	}

	async fetchById(id) {
		if (!id) {
			throw new Error('id parameter is required.');
		}
		const endpoint = `${this.baseURL}/api/v1/images/${id}`;
		try {
			const response = await https.get(endpoint);
			return response.data || response;
		} catch (error) {
			console.error(`Error fetching image by ID ${id}:`, error.message);
			throw error;
		}
	}
}

module.exports = new NekosiaAPI();