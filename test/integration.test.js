import { jest } from '@jest/globals';
import { NekosiaAPI } from '../index.js';
import https from '../services/https.js';

jest.spyOn(https, 'get');

describe('NekosiaAPI', () => {
        beforeEach(() => {
                https.get.mockReset();
        });

	describe('buildQueryParams', () => {
		it('should correctly build query params', () => {
			const options = { count: 3, additionalTags: ['tag1', 'tag2', 'tag3', 'tag4'], emptyValue: '', nullValue: null };
			const result = NekosiaAPI.buildQueryParams(options);
			expect(result).toBe('count=3&additionalTags=tag1%2Ctag2%2Ctag3%2Ctag4');
		});

		it('should return empty string for empty options', () => {
			const result = NekosiaAPI.buildQueryParams({});
			expect(result).toBe('');
		});
	});

	describe('makeHttpRequest', () => {
		it('should make a successful HTTP request', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const endpoint = 'https://api.nekosia.cat/test-endpoint';
			const res = await NekosiaAPI.makeHttpRequest(endpoint);

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(endpoint);
		});

		it('should handle HTTP request errors', async () => {
			const mockError = new Error('Request failed');
			https.get.mockRejectedValue(mockError);

			const endpoint = 'https://api.nekosia.cat/test-endpoint';

			const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

			await expect(NekosiaAPI.makeHttpRequest(endpoint)).rejects.toThrow('Request failed');
			expect(https.get).toHaveBeenCalledWith(endpoint);

			consoleErrorSpy.mockRestore();
		});
	});

	describe('fetchCategoryImages', () => {
		it('should build correct endpoint and make request for given category', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = 'https://api.nekosia.cat/api/v1/images/catgirl?count=2&additionalTags=cute';
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 2, additionalTags: 'cute' });

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});

		it('should build correct endpoint with no query params if options are empty', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = 'https://api.nekosia.cat/api/v1/images/catgirl';
			const res = await NekosiaAPI.fetchCategoryImages('catgirl');

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});

		it('should include count=1 if explicitly set', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = 'https://api.nekosia.cat/api/v1/images/catgirl?count=1';
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});

	});

	describe('fetchImages', () => {
		it('should throw an error if tags is missing', async () => {
			await expect(NekosiaAPI.fetchImages({})).rejects.toThrow('`tags` must be a non-empty array');
		});

		it('should throw an error if tags is not an array', async () => {
			await expect(NekosiaAPI.fetchImages({ tags: 'not-an-array' }))
				.rejects
				.toThrow('`tags` must be a non-empty array');
		});

		it('should correctly call fetchImages with additionalTags', async () => {
			const mockResponse = { data: { results: [] } };
			https.get.mockResolvedValue(mockResponse);

			const expectedEndpoint = 'https://api.nekosia.cat/api/v1/images/nothing?count=1&additionalTags=dark%2Cshadow';
			const res = await NekosiaAPI.fetchImages({ count: 1, tags: ['dark', 'shadow'] });

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(expectedEndpoint);
		});
	});

	describe('fetchById', () => {
		it('should throw an error if id is missing or empty', async () => {
			for (const id of [undefined, '']) {
				await expect(NekosiaAPI.fetchById(id)).rejects.toThrow('`id` parameter is required');
			}
		});

		it('should correctly fetch image by ID', async () => {
			const mockResponse = { data: { id: '123' } };
			https.get.mockResolvedValue(mockResponse);

			const id = '123';
			const res = await NekosiaAPI.fetchById(id);

			expect(res).toEqual(mockResponse);
			expect(https.get).toHaveBeenCalledWith(`https://api.nekosia.cat/api/v1/getImageById/${id}`);
		});
	});
});
