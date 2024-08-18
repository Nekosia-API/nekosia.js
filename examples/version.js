const { NekosiaVersion } = require('../index.js');

(async () => {
	console.log(NekosiaVersion.module);
	console.log(await NekosiaVersion.api());
})();