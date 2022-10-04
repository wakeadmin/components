import { expect, test } from 'vitest';
import { arrayEq } from './array';

test('arrayEq', () => {
  // @ts-expect-error
  expect(arrayEq(null, null)).toBe(true);

  // @ts-expect-error
  expect(arrayEq(undefined, null)).toBe(true);

  // @ts-expect-error
  expect(arrayEq([], null)).toBe(false);

  expect(arrayEq([], [])).toBe(true);
  expect(arrayEq([1], [])).toBe(false);
  expect(arrayEq([1, 2, 3], [1, 2, 3])).toBe(true);
  expect(arrayEq([{}], [{}])).toBe(false);
});
