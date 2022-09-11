import { describe, test, expect } from 'vitest';
import { unset, reactiveUnset } from './object';

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
