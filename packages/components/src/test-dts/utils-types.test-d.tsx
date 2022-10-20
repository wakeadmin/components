import { test, expectType, MayBeUndefined, noop } from '.';

import { ToHSlotDefinition, ToVolarSlotDefinition, ToVolarEmitDefinition, ToHEmitDefinition } from '../utils';

test('ToHSlotDefinition', () => {
  const res: ToHSlotDefinition<{
    renderA(): any;
    renderB(a: number): any;
    renderC(a: {}): any;
    renderD(a?: number): any;
  }> = noop;

  expectType<never>(res.a);
  expectType<number>(res.b);
  expectType<{}>(res.c);
  expectType<number | undefined>(res.d);
});

test('ToVolarSlotDefinition', () => {
  const res: ToVolarSlotDefinition<{
    renderA(): any;
    renderB(a: number): any;
    renderC(a: {}): any;
    renderD(a?: number): any;
  }> = noop;

  expectType<MayBeUndefined<() => any>>(res.$slots?.a);
  expectType<MayBeUndefined<(a: number) => any>>(res.$slots?.b);
  expectType<MayBeUndefined<(a: {}) => any>>(res.$slots?.c);
  expectType<MayBeUndefined<(a?: number) => any>>(res.$slots?.d);
});

test('ToVolarEmitDefinition', () => {
  const res: ToVolarEmitDefinition<{
    onA(): any;
    onB(a: number): any;
    onC(a: { foo: number }): any;
    onD(a?: number): any;
  }> = noop;

  res.$emit('a');
  // @ts-expect-error 需要传递参数
  res.$emit('b');
  res.$emit('b', 1);

  // @ts-expect-error 参数错误
  res.$emit('b', '12');

  res.$emit('c', { foo: 1 });

  // @ts-expect-error 参数错误
  res.$emit('c', { foo: 'string' });

  res.$emit('d');
  // @ts-expect-error 参数错误
  res.$emit('d', 'ce');

  // @ts-expect-error e 未定义
  res.$emit('e');
});

test('ToHEmitDefinition', () => {
  const res: ToHEmitDefinition<{ onOk: (value: number) => void; onFail: (value: {}, error: Error) => void }> = noop;

  expectType<(value: number) => void>(res.ok);
  expectType<(value: {}, error: Error) => void>(res.fail);
});
