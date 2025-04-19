const { NekosiaAPI } = require('../index.js');

describe('nekosia.js tests', () => {

	describe('fetchCategoryImages', () => {
		it('should fetch images for the given category', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });

			expect(res).toBeInstanceOf(Object);
			expect(res).toMatchObject({
				success: true,
				status: 200,
				category: expect.any(String),
				id: expect.any(String),
				image: {
					original: {
						url: expect.any(String),
						extension: expect.any(String),
					},
					compressed: {
						url: expect.any(String),
						extension: expect.any(String),
					},
				},
				metadata: {
					original: {
						width: expect.any(Number),
						height: expect.any(Number),
						size: expect.any(Number),
						extension: expect.any(String),
					},
					compressed: {
						width: expect.any(Number),
						height: expect.any(Number),
						size: expect.any(Number),
						extension: expect.any(String),
					},
				},
				tags: expect.any(Array),
				rating: expect.any(String),
				source: {
					url: expect.any(String),
				},
			});

			expect(res.tags.length).toBeGreaterThan(0);
		});

		it('should handle the random category', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('random');

			expect(res).toBeInstanceOf(Object);
			expect(res).toMatchObject({
				success: true,
				status: 200,
				category: expect.any(String),
				id: expect.any(String),
				image: {
					original: {
						url: expect.any(String),
						extension: expect.any(String),
					},
					compressed: {
						url: expect.any(String),
						extension: expect.any(String),
					},
				},
				metadata: {
					original: {
						width: expect.any(Number),
						height: expect.any(Number),
						size: expect.any(Number),
						extension: expect.any(String),
					},
					compressed: {
						width: expect.any(Number),
						height: expect.any(Number),
						size: expect.any(Number),
						extension: expect.any(String),
					},
				},
				tags: expect.any(Array),
				rating: expect.any(String),
				source: {
					url: expect.any(String),
				},
			});

			expect(res.tags.length).toBeGreaterThan(0);
		});

		it('should return an error for an invalid category', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('invalid-category', { count: 1 });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should return a specified number of images', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 3 });

			expect(res).toBeInstanceOf(Object);
			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(res).toHaveProperty('images');
			expect(res.images).toBeInstanceOf(Array);
			expect(res.images.length).toBe(3);
		});
	});

	describe('fetchImages', () => {
		it('should handle no images found for nothing category with additional tags', async () => {
			const res = await NekosiaAPI.fetchImages({ count: 1, tags: ['wTbf8J0TirS6a4fO5uyKcRazZOlO5h6o', 'xX9f9pwDAgsM3Li1LwsJ3tXQfGKW4WA0'] });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should throw an error if additionalTagsArray is empty', async () => {
			await expect(NekosiaAPI.fetchImages([])).rejects.toThrow('`tags` must be a non-empty array');
		});

		it('should return an error response for invalid count parameter', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 'invalid' });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});
	});

	describe('fetchById', () => {
		it('should fetch an image by ID if it exists', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });

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

		it('should return an error response for invalid ID format', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('12345');
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toBe('No images matching the specified criteria were found. See https://nekosia.cat/documentation?page=api-endpoints#tags-and-categories for more details.');
		});
	});

});