import { jest } from '@jest/globals';
import { NekosiaAPI } from '../index.js';
import https from '../services/https.js';

jest.spyOn(https, 'get');

const expectValidImageObject = res => {
        expect(res.success).toBe(true);
        expect(res.status).toBe(200);
        expect(res).toHaveProperty('image');
        expect(res.image.original.url).toEqual(expect.any(String));
        expect(res.tags.length).toBeGreaterThan(0);
};

const mockImage = (id = '123') => ({
       success: true,
       status: 200,
       id,
       image: { original: { url: 'https://example.com/img.png' } },
       tags: ['catgirl'],
});

const mockImages = count => ({
       success: true,
       status: 200,
       images: Array.from({ length: count }, (_, i) => mockImage(String(i))),
});

const mockError = message => ({ success: false, status: 400, message });

describe('nekosia.js tests', () => {
       beforeEach(() => {
               https.get.mockReset();
       });

        describe('fetchCategoryImages', () => {

                it('should fetch one image when count is 1', async () => {
                        https.get.mockResolvedValueOnce(mockImage());
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });
                        expectValidImageObject(res);
                });

                it('should fetch multiple images when count is between 2 and 24', async () => {
                        https.get.mockResolvedValueOnce(mockImages(3));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 3 });

			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.images)).toBe(true);
			expect(res.images.length).toBe(3);

			for (const img of res.images) {
				expect(img).toHaveProperty('image');
				expect(img.image.original.url).toEqual(expect.any(String));
			}
		});

                it('should fetch maximum allowed number of images (20)', async () => {
                        https.get.mockResolvedValueOnce(mockImages(20));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 20 });

			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.images)).toBe(true);
			expect(res.images.length).toBe(20);
		});

                it('should return error if count exceeds the maximum (999)', async () => {
                        https.get.mockResolvedValueOnce(mockError('Count must be between 1 and 24'));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 999 });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toMatch(/Count must be between 1 and/i);
		});

                it('should return error for invalid count value', async () => {
                        https.get.mockResolvedValueOnce(mockError('Invalid count'));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 'invalid' });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

                it('should return error for negative count', async () => {
                        https.get.mockResolvedValueOnce(mockError('Invalid count'));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: -5 });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

                it('should return error for count = 0', async () => {
                        https.get.mockResolvedValueOnce(mockError('Invalid count'));
                        const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 0 });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

                it('should handle random category', async () => {
                        https.get.mockResolvedValueOnce(mockImage());
                        const res = await NekosiaAPI.fetchCategoryImages('random');

			expectValidImageObject(res);
		});

                it('should return error for invalid category', async () => {
                        https.get.mockResolvedValueOnce(mockError('Invalid category'));
                        const res = await NekosiaAPI.fetchCategoryImages('invalid-category');
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});
	});

        describe('fetchImages', () => {
                it('should return error when no image matches tags', async () => {
                        https.get.mockResolvedValueOnce(mockError('No match'));
                        const res = await NekosiaAPI.fetchImages({
                                count: 1,
                                tags: ['invalid-tag1', 'invalid-tag2'],
                        });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should throw if tags array is empty', async () => {
			await expect(() => NekosiaAPI.fetchImages({ tags: [] }))
				.rejects
				.toThrow('`tags` must be a non-empty array');
		});

                it('should return a valid image for known tag', async () => {
                        https.get.mockResolvedValueOnce(mockImage());
                        const res = await NekosiaAPI.fetchImages({
                                count: 1,
                                tags: ['catgirl'],
                        });

			expectValidImageObject(res);
		});
	});

        describe('fetchById', () => {
                it('should fetch image by ID', async () => {
                        https.get.mockResolvedValueOnce(mockImage('preview'));
                        const preview = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });
                        if (!preview.success || !preview.id) throw new Error('No valid image to fetch by ID');
                        https.get.mockResolvedValueOnce(mockImage('preview'));
                        const fetched = await NekosiaAPI.fetchById(preview.id);
			expect(fetched.success).toBe(true);
			expect(fetched.status).toBe(200);
			expect(fetched.id).toBe(preview.id);
			expect(fetched).toHaveProperty('image');
		});

                it('should return error for malformed ID', async () => {
                        https.get.mockResolvedValueOnce(mockError('The image with the provided identifier was not found'));
                        const res = await NekosiaAPI.fetchById('12345');
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toMatch(/The image with the provided identifier was not found/);
		});

                it('should return error for valid format but non-existent ID', async () => {
                        https.get.mockResolvedValueOnce(mockError('Not found'));
                        const res = await NekosiaAPI.fetchById('keyboardcat');
			expect(res.success).toBe(false);
			expect(400).toBe(res.status);
		});
	});
});
