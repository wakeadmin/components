import { test, vitest, describe, expect } from 'vitest';
import { isEqual } from 'lodash-es';
import { memoizeTask } from './host';

describe('memoizeTask', () => {
  test('memoizeTask resolve', async () => {
    const task = vitest.fn(async () => 'test');

    // 只会批量执行一次
    const m = memoizeTask(task);

    const a1 = m();
    const a2 = m();
    const a3 = m();

    const result = await Promise.all([a1, a2, a3]);
    expect(result).toEqual(['test', 'test', 'test']);

    // 只会执行一次
    expect(task).toBeCalledTimes(1);
    expect(await m()).toBe('test');
  });

  test('memoizeTask reject', async () => {
    const task = vitest.fn(() => Promise.reject(new Error('holy shit')));

    const m = memoizeTask(task);

    const a1 = m();
    const a2 = m();
    const a3 = m();

    const result = await Promise.allSettled([a1, a2, a3]);
    expect(result.map(i => i.status)).toEqual(['rejected', 'rejected', 'rejected']);

    // 只会执行一次
    expect(task).toBeCalledTimes(1);
  });

  test('single parameter', async () => {
    const task = vitest.fn(async (a: number) => a);

    // 只会批量执行一次
    const m = memoizeTask(task);

    const a1 = m(1);
    const a2 = m(1);
    const a3 = m(2);

    const result = await Promise.all([a1, a2, a3]);
    expect(result).toEqual([1, 1, 2]);

    // 只会执行一次
    expect(task).toBeCalledTimes(2);
    expect(await m(1)).toBe(1);
  });

  test('multi parameter', async () => {
    const task = vitest.fn(async (a: number, b: number) => a + b);

    // 只会批量执行一次
    const m = memoizeTask(task);

    const a1 = m(1, 1);
    const a2 = m(1, 1);
    const a3 = m(2, 3);

    const result = await Promise.all([a1, a2, a3]);
    expect(result).toEqual([2, 2, 5]);

    // 只会执行一次
    expect(task).toBeCalledTimes(2);
    expect(await m(1, 1)).toBe(2);
  });

  test('multi parameter with custom detector', async () => {
    const task = vitest.fn(async (a: { v: number }, b: { v: number }) => a.v + b.v);

    // 只会批量执行一次
    const m = memoizeTask(task, isEqual);

    const a1 = m({ v: 1 }, { v: 1 });
    const a2 = m({ v: 1 }, { v: 1 });
    const a3 = m({ v: 2 }, { v: 3 });

    const result = await Promise.all([a1, a2, a3]);
    expect(result).toEqual([2, 2, 5]);

    // 只会执行一次
    expect(task).toBeCalledTimes(2);
    expect(await m({ v: 1 }, { v: 1 })).toBe(2);
  });
});
