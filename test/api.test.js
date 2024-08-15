const NekosiaAPI = require('../index.js');

describe('NekosiaAPI (API Tests)', () => {

	describe('fetchImagesByCategory', () => {
		it('should fetch images for the given category', async () => {
			const res = await NekosiaAPI.fetchImagesByCategory('catgirl', { count: 1 });

			expect(res).toBeInstanceOf(Object);
			expect(res.success).toBe(true);
			expect(res.status).toBe(200);

			expect(res).toHaveProperty('category');
			expect(res).toHaveProperty('id');
			expect(res).toHaveProperty('image');

			expect(res.image).toHaveProperty('original');
			expect(res.image).toHaveProperty('compressed');
			expect(res.image.original).toHaveProperty('url');
			expect(res.image.original).toHaveProperty('extension');
			expect(res.image.compressed).toHaveProperty('url');
			expect(res.image.compressed).toHaveProperty('extension');

			expect(res.metadata).toHaveProperty('original');
			expect(res.metadata.original).toHaveProperty('width');
			expect(res.metadata.original).toHaveProperty('height');
			expect(res.metadata.original).toHaveProperty('size');
			expect(res.metadata.original).toHaveProperty('extension');

			expect(res.metadata).toHaveProperty('compressed');
			expect(res.metadata.compressed).toHaveProperty('width');
			expect(res.metadata.compressed).toHaveProperty('height');
			expect(res.metadata.compressed).toHaveProperty('size');
			expect(res.metadata.compressed).toHaveProperty('extension');

			expect(res).toHaveProperty('tags');
			expect(res.tags).toBeInstanceOf(Array);
			expect(res.tags.length).toBeGreaterThan(0);

			expect(res).toHaveProperty('rating');
			expect(res).toHaveProperty('source');
			expect(res.source).toHaveProperty('url');
		});

		it('should return an error for an invalid category', async () => {
			const res = await NekosiaAPI.fetchImagesByCategory('invalid-category', { count: 1 });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should return a specified number of images', async () => {
			const res = await NekosiaAPI.fetchImagesByCategory('catgirl', { count: 3 });

			expect(res).toBeInstanceOf(Object);
			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(res.count).toBe(3);
			expect(res).toHaveProperty('images');
			expect(res.images).toBeInstanceOf(Array);
			expect(res.images.length).toBe(3);
		});
	});

	describe('fetchShadowImages', () => {
		it('should handle no images found for shadow category with additional tags', async () => {
			const res = await NekosiaAPI.fetchShadowImages(['wTbf8J0TirS6a4fO5uyKcRazZOlO5h6o', 'xX9f9pwDAgsM3Li1LwsJ3tXQfGKW4WA0'], { count: 1 });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should throw an error if additionalTagsArray is empty', async () => {
			await expect(NekosiaAPI.fetchShadowImages([])).rejects.toThrow('additionalTagsArray must be a non-empty array for the shadow category.');
		});

		it('should return an error response for invalid count parameter', async () => {
			const res = await NekosiaAPI.fetchImagesByCategory('catgirl', { count: 'invalid' });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toBe('Invalid count parameter. Expected a number between 1 and 48.');
		});
	});

	describe('fetchById', () => {
		it('should fetch an image by ID if it exists', async () => {
			const res = await NekosiaAPI.fetchImagesByCategory('catgirl', { count: 1 });

			if (res.success && res.id) {
				const id = res.id;

				const res2 = await NekosiaAPI.fetchById(id);
				expect(res2.success).toBe(true);
				expect(res2.status).toBe(200);
				expect(res2).toHaveProperty('id', id);
				expect(res2).toHaveProperty('image');
			} else {
				throw new Error('No images available to fetch by ID');
			}
		});

		it('should return multiple images for shadow category with valid tags', async () => {
			const res = await NekosiaAPI.fetchShadowImages(['catgirl', 'foxgirl'], { count: 7 });
			expect(res.status).toBe(200);
			expect(res.count).toBe(7);
			expect(res.images).toBeInstanceOf(Array);
			expect(res.images.length).toBe(7);
		});

		it('should return an error response for invalid ID format', async () => {
			const res = await NekosiaAPI.fetchById(12345);
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toBe('The image with the provided identifier was not found.');
		});
	});

});