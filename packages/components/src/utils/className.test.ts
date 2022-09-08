import { test, expect } from 'vitest';
import { normalizeClassName } from './className';

test('normalizeClassName', () => {
  expect(normalizeClassName()).toBe('');
  expect(normalizeClassName('hello')).toBe('hello');
  expect(normalizeClassName('hello', 'world')).toBe('hello world');
  expect(normalizeClassName('hello', 'world', {})).toBe('hello world');
  expect(normalizeClassName('hello', 'world', { foo: true, bar: false, baz: [] })).toBe('hello world foo baz');
  expect(
    normalizeClassName('hello', 'world', { foo: true, bar: false, baz: [] }, ['one', 'two', { three: true }, ['four']])
  ).toBe('hello world foo baz one two three four');
});
