import { expect, test, beforeEach , it} from 'vitest';
import { arrayEq , moveItemInArray} from './array';

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


test('moveItemInArray', () => {
  let array: number[];

  beforeEach(() => {
    array = [0, 1, 2, 3]
  });

  it('should be able to move an item inside an array', () => {
    moveItemInArray(array, 1, 3);
    expect(array).toEqual([0, 2, 3, 1]);
  });

  it('should not do anything if the index is the same', () => {
    moveItemInArray(array, 2, 2);
    expect(array).toEqual([0, 1, 2, 3]);
  });

  it('should handle an index greater than the length', () => {
    moveItemInArray(array, 0, 7);
    expect(array).toEqual([1, 2, 3, 0]);
  });

  it('should handle an index less than zero', () => {
    moveItemInArray(array, 3, -1);
    expect(array).toEqual([3, 0, 1, 2]);
  });
});