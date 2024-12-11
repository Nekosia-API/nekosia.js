const https = require('./services/https.js');
const BASE_URL = 'https://api.nekosia.cat';
const API_URL = `${BASE_URL}/api/v1`;

class NekosiaAPI {
	buildQueryParams(options = {}) {
		return Object.entries(options)
			.filter(([, value]) => {
				if (typeof value === 'string' && value.includes(',')) {
					throw new Error('A single tag in the string cannot contain commas. Please use an array instead.');
				}

				return value != null && value !== '' && (!Array.isArray(value) || value.length > 0);
			})
			.map(([key, value]) => `${encodeURIComponent(key)}=${value}`)
			.join('&');
	}

	async makeHttpRequest(endpoint) {
		try {
			return https.get(endpoint);
		} catch (err) {
			console.error(`HTTP request failed for endpoint ${endpoint}: ${err.message}`);
			throw err;
		}
	}

	async fetchCategoryImages(category, options = {}) {
		if (!category) {
			throw new Error('The image category is required. For example, use fetchCategoryImages(\'catgirl\').');
		}

		if (options.session && !['id', 'ip'].includes(options.session)) {
			throw new Error('The `session` setting can contain only the following values `id` and `ip`, both as strings.');
		}

		if (!options.session && options.id) {
			throw new Error('`id` is not required if the session is `null` or `undefined`');
		}

		return this.makeHttpRequest(`${API_URL}/images/${category}?${this.buildQueryParams(options)}`);
	}

	async fetchImages(options = {}) {
		if (!Array.isArray(options.tags) || options.tags.length === 0) {
			throw new Error('`tags` must be a non-empty array');
		}

		if (Array.isArray(options.blacklistedTags)) {
			throw new Error('Unexpected `blacklistedTags` in `fetchImages()`, use `blacklist` instead');
		}

		return this.fetchCategoryImages('nothing', {
			session: options.session,
			id: options.id,
			count: options.count,
			additionalTags: options.tags,
			blacklistedTags: options.blacklist,
		});
	}

	async fetchTags() {
		return this.makeHttpRequest(`${API_URL}/tags`);
	}

	async fetchById(id) {
		if (!id) throw new Error('`id` parameter is required');

		return this.makeHttpRequest(`${API_URL}/getImageById/${id}`);
	}
}

const NekosiaVersion = {
	module: https.version,
	api: async () => https.get(BASE_URL),
};

module.exports = {
	NekosiaAPI: new NekosiaAPI(),
	NekosiaVersion,
};