import { NekosiaAPI as ESMAPI, NekosiaVersion as ESMVersion } from '../index.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { NekosiaAPI, NekosiaVersion, default: defaultExport } = require('../index.cjs');

export const noop = () => {};

describe('CommonJS build', () => {
        it('exports match the ESM build', () => {
                expect(typeof NekosiaAPI.fetchTags).toBe('function');
                expect(NekosiaVersion.module).toBe(ESMVersion.module);
                expect(defaultExport.NekosiaAPI).toBe(NekosiaAPI);
        });
});
