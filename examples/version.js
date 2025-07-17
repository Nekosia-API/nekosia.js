import { NekosiaVersion } from '../index.js';

(async () => {
	console.log(`Nekosia.js: v${NekosiaVersion.module}`);

	const data = await NekosiaVersion.api();
	console.log(`API: v${data.version}`);
})();
