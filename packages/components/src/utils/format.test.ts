import { test, expect } from 'vitest';

import { formatFileSize, GB, KB, MB, PB } from './format';

test('formatFileSize', () => {
  expect(formatFileSize(500)).toBe('500 B');
  expect(formatFileSize(KB)).toBe('1 KB');
  expect(formatFileSize(MB)).toBe('1 MB');
  expect(formatFileSize(MB + 10000)).toBe('1.01 MB');
  expect(formatFileSize(2 * MB)).toBe('2 MB');
  expect(formatFileSize(2 * GB)).toBe('2 GB');
  expect(formatFileSize(GB + 0.5 * GB)).toBe('1.5 GB');
  expect(formatFileSize(GB + 0.55 * GB)).toBe('1.55 GB');
  expect(formatFileSize(5000 * PB)).toBe('5000 PB');
});
