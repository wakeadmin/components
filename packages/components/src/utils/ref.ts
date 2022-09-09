import { customRef } from '@wakeadmin/demi';

export function staticRef<T>(value: T) {
  return customRef(() => {
    return {
      get() {
        return value;
      },
      // readonly
      set() {},
    };
  });
}

/**
 * 组件引用 ref，纯静态不响应
 */
export function instanceRef<T>() {
  let instance: T | undefined;
  return customRef<T | undefined>(() => {
    return {
      get() {
        return instance;
      },
      set(v) {
        instance = v;
      },
    };
  });
}

export function getterRef<T>(getter: () => T) {
  return customRef(() => {
    return {
      get() {
        return getter();
      },
      // readonly
      set() {},
    };
  });
}
