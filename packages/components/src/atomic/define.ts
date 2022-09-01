import { declareComponent, declareProps, h } from '@wakeadmin/h';
import { shallowReactive, watch, set as $set } from '@wakeadmin/demi';

import { Atomic, AtomicCommonProps } from './types';

export function defineAtomic<P extends AtomicCommonProps<any>>(a: Atomic<any, P>): Atomic<any, P> {
  return a;
}

/**
 * 用于创建原件函数组件
 * note: 所有参数都通过 props 传递，包括 slots、events
 * @param setup
 * @param name
 */
export function defineAtomicComponent<P extends AtomicCommonProps<any>>(
  setup: (props: P) => () => any,
  name?: string
): (props: P) => any {
  const Component = declareComponent({
    name,
    props: declareProps<{ properties: any }>(['properties']),
    setup(props) {
      const properties = shallowReactive<Record<string, any>>({});

      watch(
        () => props.properties,
        p => {
          // 浅拷贝
          for (const key in p) {
            const value = p[key];
            if (key in properties) {
              if (properties[key] !== value) {
                properties[key] = value;
              }
            } else {
              $set(properties, key, value);
            }
          }
        },
        { immediate: true }
      );

      return setup(properties as P);
    },
  });

  return properties => {
    return h(Component, { properties });
  };
}
