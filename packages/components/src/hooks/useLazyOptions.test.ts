import { delay } from '@wakeadmin/utils';
import { ref } from '@wakeadmin/demi';
import { test, vitest, expect } from 'vitest';

import { useLazyOptions } from './useLazyOptions';

test('useLazyOptions', async () => {
  const fn = vitest.fn(() => Promise.resolve('test'));
  const ret = useLazyOptions(fn, 'initial');

  expect(ret.loading.value).toBe(true);

  await delay(10);

  expect(ret.value.value).toBe('test');
  expect(ret.loading.value).toBe(false);
});

test('useLazyOptions static', async () => {
  const value = ref('test');
  const ret = useLazyOptions(value, 'initial');

  expect(ret.loading.value).toBe(false);
  expect(ret.value.value).toBe('test');

  value.value = 'hello';

  expect(ret.value.value).toBe('hello');
});
