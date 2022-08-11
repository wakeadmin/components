import { switchVersion } from './utils.js';

const version = process.argv[2];

if (version === '2') {
  switchVersion(2);
  console.log(`[vue-adapter] Switched for Vue 2)`);
} else {
  switchVersion(2);
  console.log(`[vue-adapter] Switched for Vue 3)`);
}
