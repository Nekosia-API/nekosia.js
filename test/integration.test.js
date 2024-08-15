const api = require('../index.js');
const https = require('../services/https.js');
const categories = require('../categories.js');

jest.mock('../services/https.js');

describe('NekosiaAPI', () => {
	beforeEach(() => {
		https.get.mockClear();
	});

	describe('initializeCategoryMethods', () => {
		it('should create methods for each category', () => {
			categories.forEach(category => {
				const methodName = `fetch${category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, '')}Images`;
				expect(typeof api[methodName]).toBe('function');
			});
		});
	});

	describe('buildQueryParams', () => {
		it('should correctly build query params', () => {
			const options = { count: 3, additionalTags: 'tag1,tag2', emptyValue: '', nullValue: null };
			const result = api.buildQueryParams(options);
			expect(result).toBe('count=3&additionalTags=tag1%2Ctag2');
		});
	});

	describe('makeHttpRequest', () => {
		it('should make a successful HTTP request', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const endpoint = 'https://api.nekosia.cat/test-endpoint';
			const res = await api.makeHttpRequest(endpoint);

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(endpoint);
		});

		it('should handle HTTP request errors', async () => {
			const mockError = new Error('Request failed');
			https.get.mockRejectedValue(mockError);

			const endpoint = 'https://api.nekosia.cat/test-endpoint';

			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

			await expect(api.makeHttpRequest(endpoint)).rejects.toThrow('Request failed');
			expect(https.get).toHaveBeenCalledWith(endpoint);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('fetchImagesByCategory', () => {
		it('should build correct endpoint and make request', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = `${api.baseURL}/api/v1/images/catgirl?count=2&additionalTags=cute`;
			const res = await api.fetchImagesByCategory('catgirl', { count: 2, additionalTags: 'cute' });

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});
	});

	describe('fetchShadowImages', () => {
		it('should throw an error if additionalTagsArray is empty', async () => {
			await expect(api.fetchShadowImages([])).rejects.toThrow('additionalTagsArray must be a non-empty array for the shadow category.');
		});

		it('should correctly call fetchImagesByCategory with additionalTags', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = `${api.baseURL}/api/v1/images/shadow?count=1&additionalTags=dark%2Cshadow`;
			const res = await api.fetchShadowImages(['dark', 'shadow'], { count: 1 });

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});
	});

	describe('fetchById', () => {
		it('should throw an error if id is not provided', async () => {
			await expect(api.fetchById()).rejects.toThrow('id parameter is required.');
		});

		it('should correctly fetch image by ID', async () => {
			const mockResponse = { data: { id: '123' } };
			https.get.mockResolvedValue(mockResponse);

			const id = '123';
			const res = await api.fetchById(id);

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(`${api.baseURL}/api/v1/getImageById/${id}`);
		});
	});
});