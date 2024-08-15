const https = require('https');
const { name, version, homepage, devDependencies } = require('../package.json');

const headers = {
	'User-Agent': `Mozilla/5.0 (compatible; ${name}/${version}; +${homepage})${process.env.JEST_WORKER_ID ? ` jest/${devDependencies.jest.replace(/^[^0-9]*/, '')}` : ''}`,
	'Accept': 'application/json',
	'Content-Type': 'application/json',
	'Cache-Control': 'no-cache',
	'Connection': 'keep-alive',
	'DNT': '1'
};

const makeRequest = url => new Promise((resolve, reject) => {
	const req = https.get(url, { headers, timeout: 9000 }, res => {
		let data = '';

		res.on('data', chunk => {
			data += chunk;
		});

		res.on('end', () => {
			if ((res.statusCode < 200 || res.statusCode >= 300) && res.statusCode !== 400) {
				return reject(new Error(`HTTP Status Code: ${res.statusCode}`));
			}

			try {
				const parsedData = JSON.parse(data);
				resolve(parsedData);
			} catch (err) {
				reject(new Error(`Failed to parse JSON: ${err.message}. Response: ${data}`));
			}
		});
	});

	req.on('error', err => reject(new Error(`Request error: ${err.message}`)));

	req.on('timeout', () => {
		req.destroy();
		reject(new Error('Timeout error'));
	});

	req.end();
});

module.exports = { get: makeRequest, version };