import { test, expectType } from '.';

import { ToHSlotDefinition } from '../utils';

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
