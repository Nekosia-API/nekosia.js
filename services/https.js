const client = require(process.env.NEKOSIA_API_LOCAL ? 'http' : 'https');
const { name, version, devDependencies } = require('../package.json');

const headers = {
	'User-Agent': `${name}/${version} (+https://github.com/Nekosia-API/nekosia.js)${process.env.JEST_WORKER_ID ? ` jest/${devDependencies.jest.replace(/^[^0-9]*/, '')}` : ''}`,
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive',
	'DNT': '1',
};

const timeout = process.env.NEKOSIA_API_TIMEOUT || 15000;

const agent = new client.Agent({ keepAlive: true });
const isJsonContentType = contentType => typeof contentType === 'string' && contentType.includes('application/json');

const get = async url => {
	if (!url || typeof url !== 'string') throw new Error('Missing URL, expected a string');

	return new Promise((resolve, reject) => {
		const req = client.get(url, { headers, agent }, res => {
			const { statusCode } = res;
			const contentType = res.headers['content-type'];
			let data = '';

			res.on('data', chunk => {
				data += chunk;
			});

			res.on('end', () => {
				if (!isJsonContentType(contentType)) {
					return reject(new Error(`Expected application/json response, received: ${contentType ?? 'unknown'}`));
				}

				try {
					const payload = JSON.parse(data);
					const isSuccessfulStatus = statusCode >= 200 && statusCode < 300;
					if (!isSuccessfulStatus && (payload == null || typeof payload !== 'object')) {
						return reject(new Error(`Unexpected HTTP Status Code: ${statusCode ?? 'unknown'}`));
					}

					resolve(payload);
				} catch {
					reject(new Error('Invalid JSON response'));
				}
			});
		});

		req.setTimeout(timeout, () => {
			req.destroy();
			reject(new Error(`Request timed out after ${timeout} ms`));
		});

		req.once('error', reject);
	});
};

module.exports = { get, version };
