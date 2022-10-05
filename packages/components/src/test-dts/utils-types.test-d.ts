import { test, expectType, MayBeUndefined } from '.';

import { ToHSlotDefinition, ToVolarSlotDefinition, ToHEmitDefinition } from '../utils';

declare const noop: any;

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

test('ToHEmitDefinition', () => {
  const res: ToHEmitDefinition<{ onOk: (value: number) => void; onFail: (value: {}, error: Error) => void }> = noop;

  expectType<(value: number) => void>(res.ok);
  expectType<(value: {}, error: Error) => void>(res.fail);
});
