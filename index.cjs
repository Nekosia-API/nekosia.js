const https = require('./services/https.cjs');
const { version: moduleVersion } = https;

const BASE_URL = 'https://api.nekosia.cat';
const API_URL = `${BASE_URL}/api/v1`;

class InternalNekosiaAPI {
        buildQueryParams(options = {}) {
                return Object.entries(options)
                        .filter(([, value]) =>
                                value != null &&
                                value !== '' &&
                                (!Array.isArray(value) || value.length > 0)
                        )
                        .map(([key, value]) => {
                                if (Array.isArray(value)) {
                                        return `${encodeURIComponent(key)}=${value.map(v => encodeURIComponent(v)).join('%2C')}`;
                                }
                                if (typeof value === 'string' && value.includes(',')) {
                                        throw new Error('String values must not contain commas. Use an array instead.');
                                }
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

                if (options.session && !['id', 'ip'].includes(options.session)) {
                        throw new Error('The `session` setting can contain only the following values `id` and `ip`, both as strings');
                }

                if (!options.session && options.id) {
                        throw new Error('`id` is not required if the session is `null` or `undefined`');
                }

                const query = this.buildQueryParams(options);
                return this.makeHttpRequest(`${API_URL}/images/${encodeURIComponent(category)}${query ? `?${query}` : ''}`);
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
                if (typeof id !== 'string' || !id.trim()) throw new Error('`id` parameter is required');
                return this.makeHttpRequest(`${API_URL}/getImageById/${id}`);
        }
}

const NekosiaVersion = {
        module: moduleVersion,
        api: async () => https.get(BASE_URL),
};

const NekosiaAPI = new InternalNekosiaAPI();

const exportsObject = { NekosiaAPI, NekosiaVersion };
module.exports = exportsObject;
module.exports.default = exportsObject;
