import { describe, test, expect } from 'vitest';
import { unset, reactiveUnset, sideEffectLessMerge } from './object';
import m from 'lodash/merge';

test('merge', () => {
  expect(sideEffectLessMerge(null, null)).toEqual({});
  expect(sideEffectLessMerge(undefined, undefined)).toEqual({});
  expect(sideEffectLessMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  expect(sideEffectLessMerge({ a: { c: { foo: 1 } } }, { a: { c: { bar: 2 } } })).toEqual({
    a: {
      c: {
        bar: 2,
        foo: 1,
      },
    },
  });
  expect(m({ a: [1] }, { a: [2] })).toEqual({ a: [2] });
  expect(sideEffectLessMerge({ a: [1] }, { a: [2] })).toEqual({ a: [2] });

  // symbol
  const s1 = Symbol(1);
  const s2 = Symbol(2);
  expect(
    sideEffectLessMerge(
      {
        [s1]: 1,
      },
      { [s2]: 2 }
    )
  ).toEqual({
    [s1]: 1,
    [s2]: 2,
  });
});

describe('unset', () => {
  test('array', () => {
    const a: any = [];

    unset(a, '0');
    unset(a, '1');
    unset(a, '4');
    unset(a, '-1');

    expect(a).toEqual([]);

    const b = [1, 2, 3];
    unset(b, '1');
    expect(b).toEqual([1, 3]);

    const c = { a: [1, 2, 3] };
    unset(c, 'a.1');
    expect(c).toEqual({ a: [1, 3] });
  });

  test('object', () => {
    const a = { a: { b: 1 } };
    unset(a, 'a.b');
    expect(a).toEqual({ a: {} });
  });
});

test('reactiveUnset', () => {
  const a = { a: { b: 1, c: [1, 2, 3] } };
  reactiveUnset(a, 'a.b');
  expect(a).toEqual({ a: { c: [1, 2, 3] } });

  reactiveUnset(a, 'a.c.1');
  expect(a).toEqual({ a: { c: [1, 3] } });
});
