import { test, expect, vi } from 'vitest';
import { mergeProps } from './merge-props';

vi.mock('@wakeadmin/demi', () => ({ isVue2: true }));

test('mergeProps', () => {
  expect(mergeProps({})).toEqual({});
  expect(mergeProps({ class: 'foo', className: 'bar' }, { class: ['bar'], className: 'foo' })).toEqual({
    class: 'foo bar',
    className: 'bar foo',
  });
  expect(mergeProps({ style: 'color: red' }, { style: [{ background: 'red' }] })).toEqual({
    style: { color: 'red', background: 'red' },
  });

  const handle1 = () => {};
  const handle2 = () => {};

  expect(mergeProps({ onHello: handle1, onWorld: handle1 }, { onHello: handle2 })).toEqual({
    onHello: [handle1, handle2],
    onWorld: handle1,
  });

  // vue2 特殊属性合并
  expect(mergeProps({ attrs: { foo: 1 } }, { attrs: { bar: 2 } })).toEqual({ attrs: { foo: 1, bar: 2 } });

  // vue2 事件处理器
  expect(mergeProps({ on: { foo: handle1 } }, { on: { foo: handle2, bar: handle2 } })).toEqual({
    on: {
      foo: [handle1, handle2],
      bar: handle2,
    },
  });
});
