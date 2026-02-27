const https = require('./services/https.js');
const BASE_URL = process.env.NEKOSIA_API_LOCAL || 'https://api.nekosia.cat';
const API_URL = `${BASE_URL}/api/v1`;
const VALID_SESSIONS = new Set(['id', 'ip']);

class NekosiaAPI {
	buildQueryParams(options = {}) {
		return Object.entries(options)
			.filter(([, value]) =>
				value != null &&
				value !== '' &&
				(!Array.isArray(value) || value.length > 0)
			)
			.map(([key, value]) => {
				if (Array.isArray(value)) return `${encodeURIComponent(key)}=${value.map(v => encodeURIComponent(v)).join('%2C')}`;
				if (typeof value === 'string' && value.includes(',')) throw new Error('String values must not contain commas. Use an array instead.');

				return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
			})
			.join('&');
	}

	async makeHttpRequest(endpoint) {
		return https.get(endpoint);
	}

	async fetchCategoryImages(category, options = {}) {
		if (typeof category !== 'string' || !category.trim()) {
			throw new Error('Image category is required. For example: fetchCategoryImages(\'catgirl\')');
		}

		if (options.session && !VALID_SESSIONS.has(options.session)) {
			throw new Error('The `session` setting can contain only the following values `id` and `ip`, both as strings');
		}

		if (options.id != null && (typeof options.id !== 'string' || !options.id.trim())) {
			throw new Error('`id` must be a non-empty string when provided');
		}

		if (options.session === 'id' && !options.id) {
			throw new Error('`id` is required when the `session` is set to `id`');
		}

		if (options.session !== 'id' && options.id != null) {
			throw new Error('`id` can only be used when the `session` is set to `id`');
		}

		const normalizedOptions = {
			...options,
			id: typeof options.id === 'string' ? options.id.trim() : options.id,
		};

		const query = this.buildQueryParams(normalizedOptions);
		return this.makeHttpRequest(`${API_URL}/images/${encodeURIComponent(category.trim())}${query ? `?${query}` : ''}`);
	}

	async fetchImages(options = {}) {
		if (!Array.isArray(options.tags) || options.tags.length === 0) {
			throw new Error('`tags` must be a non-empty array');
		}

		if (options.blacklistedTags !== undefined) {
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
		if (typeof id !== 'string' || !id.trim()) throw new Error('`id` parameter is required');
		return this.makeHttpRequest(`${API_URL}/getImageById/${encodeURIComponent(id.trim())}`);
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
