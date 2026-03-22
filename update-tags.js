const https = require('node:https');
const fs = require('node:fs');
const path = require('node:path');

const API_URL = 'https://api.nekosia.cat/api/v1/tags';
const OUTPUT_PATH = path.join(__dirname, 'types', 'tags.ts');

const fetch = url => new Promise((resolve, reject) => {
	const req = https.get(url, { headers: { 'Accept': 'application/json' } }, res => {
		let data = '';
		res.on('data', chunk => (data += chunk));
		res.on('end', () => {
			try {
				resolve(JSON.parse(data));
			} catch {
				reject(new Error('Invalid JSON response'));
			}
		});
	});

	req.setTimeout(15000, () => {
		req.destroy();
		reject(new Error('Request timed out'));
	});

	req.once('error', reject);
});

(async () => {
	console.log(`Fetching tags from ${API_URL}...`);

	const data = await fetch(API_URL);

	if (!data.success || !Array.isArray(data.tags) || data.tags.length === 0) {
		throw new Error(`Unexpected API response: ${JSON.stringify(data)}`);
	}

	const sorted = [...data.tags].sort();
	const tagsLine = sorted.map(t => `'${t}'`).join(',');
	const content = `export const TAGS =\n    [${tagsLine}] as const;\n\n// GET ${API_URL}\n`;

	const existing = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, 'utf-8') : '';
	if (existing === content) {
		console.log('Tags are already up to date.');
		return;
	}

	fs.writeFileSync(OUTPUT_PATH, content, 'utf-8');
	console.log(`Updated ${OUTPUT_PATH} with ${sorted.length} tags.`);
})().catch(err => {
	console.error('Error:', err.message);
	process.exit(1);
});
