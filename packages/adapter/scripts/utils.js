import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.resolve(__dirname, '..', 'lib');
const require = createRequire(import.meta.url);

export function loadModule(name) {
  try {
    // eslint-disable-next-line import/no-dynamic-require
    return require(name);
  } catch (e) {
    return undefined;
  }
}

export function switchVersion(version) {
  const file = path.join(dir, 'index.js');
  const dtsfile = path.join(dir, 'index.d.ts');

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(file, `export * from '../dist/v${version}'`);
  fs.writeFileSync(dtsfile, `export * from '../dist/v${version}'`);
}
