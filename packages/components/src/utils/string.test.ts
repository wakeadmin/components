import { expect, test } from 'vitest';
import { filterStringByRegexp } from './string';

test('filterStringByRegexp', () => {
  expect(filterStringByRegexp('hello', /.*/)).toBe('hello');
  expect(filterStringByRegexp(' hello hello', /[a-z]+/)).toBe('hello');
  expect(filterStringByRegexp(' hello hello', /[a-z]+/g)).toBe('hello');

  // trim
  expect(filterStringByRegexp(' hello hello  ', /\S(.*\S)?/)).toBe('hello hello');

  // chinese
  expect(filterStringByRegexp(' 你好 666', /[\u4e00-\u9fa5]+/)).toBe('你好');

  // javascript identifier
  expect(filterStringByRegexp(' 0$123', /[_$a-zA-Z]{1}[a-zA-Z0-9_$]*/)).toBe('$123');
});
