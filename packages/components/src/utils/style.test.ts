import { expect, test } from 'vitest';

import { normalizeStyle } from './style';

test('normalizeStyle', () => {
  expect(normalizeStyle({})).toEqual({});
  expect(normalizeStyle({ color: 'red', background: 'red' })).toEqual({ color: 'red', background: 'red' });
  expect(normalizeStyle('color: red;background: red')).toEqual({ color: 'red', background: 'red' });
  expect(
    normalizeStyle(
      'color: red;background: red;justify-content: center',
      { display: 'flex' },
      [],
      [{ alignItems: 'center' }, undefined, [], 'left: 1px', [{ top: '1px' }]]
    )
  ).toEqual({
    color: 'red',
    background: 'red',
    display: 'flex',
    alignItems: 'center',
    'justify-content': 'center',
    left: '1px',
    top: '1px',
  });
});
