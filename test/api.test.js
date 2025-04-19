const { NekosiaAPI } = require('../index.js');

describe('nekosia.js tests', () => {

	describe('fetchCategoryImages', () => {
		it('should fetch one image when count is 1', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });

			expect(res).toBeInstanceOf(Object);
			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(res).toHaveProperty('image');
			expect(res.image.original.url).toEqual(expect.any(String));
			expect(res.tags.length).toBeGreaterThan(0);
		});

		it('should return error if count exceeds the maximum (25)', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 25 });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toMatch(/Invalid count parameter/i);
		});


		it('should fetch multiple images when count > 1', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 3 });

			expect(res).toBeInstanceOf(Object);
			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(Array.isArray(res.images)).toBe(true);
			expect(res.images.length).toBe(3);
			for (const img of res.images) {
				expect(img).toHaveProperty('image');
				expect(img.image.original.url).toEqual(expect.any(String));
			}
		});

		it('should handle random category', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('random');

			expect(res.success).toBe(true);
			expect(res.status).toBe(200);
			expect(res).toHaveProperty('image');
		});

		it('should return error for invalid category', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('invalid-category');
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should return error for invalid count value', async () => {
			const res = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 'invalid' });
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});
	});

	describe('fetchImages', () => {
		it('should return error when no image matches tags', async () => {
			const res = await NekosiaAPI.fetchImages({ count: 1, tags: ['invalid-tag1', 'invalid-tag2'] });

			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
		});

		it('should throw if tags array is empty', async () => {
			await expect(() => NekosiaAPI.fetchImages({ tags: [] }))
				.rejects
				.toThrow('`tags` must be a non-empty array');
		});
	});

	describe('fetchById', () => {
		it('should fetch image by ID', async () => {
			const preview = await NekosiaAPI.fetchCategoryImages('catgirl', { count: 1 });
			if (!preview.success || !preview.id) throw new Error('No valid image to fetch by ID');

			const fetched = await NekosiaAPI.fetchById(preview.id);
			expect(fetched.success).toBe(true);
			expect(fetched.status).toBe(200);
			expect(fetched.id).toBe(preview.id);
			expect(fetched).toHaveProperty('image');
		});

		it('should return error for malformed ID', async () => {
			const res = await NekosiaAPI.fetchById('12345');
			expect(res.success).toBe(false);
			expect(res.status).toBe(400);
			expect(res.message).toMatch(/The image with the provided identifier was not found/);
		});
	});
});