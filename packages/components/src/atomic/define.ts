import { Atomic, AtomicCommonProps } from './types';

export function defineAtomic<P extends AtomicCommonProps<any>>(a: Atomic<any, P>): Atomic<any, P> {
  return a;
}
