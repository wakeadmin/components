import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'lib');
const require = createRequire(import.meta.url);

const sourceDir = '../dist';

export function loadModule(name) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(name);
  } catch (e) {
    return undefined;
  }
}

export function switchVersion(version) {
  const esm = path.join(dir, 'index.js');
  const cm = path.join(dir, 'index.cjs');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(esm, `export * from '${sourceDir}/v${version}'`);
  fs.writeFileSync(cm, `module.exports = require('${sourceDir}/common/v${version}')`);
}
