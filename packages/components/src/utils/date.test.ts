import { test, expect } from 'vitest';

import { normalizeToDayjsFormat } from './date';

test('normalizeToDayjsFormat', () => {
  expect(normalizeToDayjsFormat('yyyy-MM-dd')).toBe('YYYY-MM-DD');
  expect(normalizeToDayjsFormat('yyyy-MM-dd HH:mm:SS')).toBe('YYYY-MM-DD HH:mm:ss');
  expect(normalizeToDayjsFormat('WW')).toBe('ww');
  expect(normalizeToDayjsFormat('timestamp')).toBe('x');
});
