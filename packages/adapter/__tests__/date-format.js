import { normalizeDateFormat } from '../src/shared/date-format';

test('normalizeDateFormat', () => {
  expect(normalizeDateFormat('YYYY-MM-DD HH:mm:ss')).toBe('yyyy-MM-dd HH:mm:SS');
  expect(normalizeDateFormat('w x')).toBe('W timestamp');
});
