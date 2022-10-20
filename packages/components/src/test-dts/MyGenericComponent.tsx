import { OurComponentInstance } from '../utils';

import { noop } from '.';

interface Events<T> {
  onChange?: (value: T) => void;
}

interface Slots<T> {
  renderLabel?: (value: { foo: number; value: T }) => any;
}

interface Props<T> extends Events<T>, Slots<T> {
  value?: T;
}

interface Expose<T> {
  getValue(): T;
}

export const MyGenericComponent: new <T>(props: Props<T>) => OurComponentInstance<
  typeof props,
  Slots<T>,
  Events<T>,
  Expose<T>
> = noop;
