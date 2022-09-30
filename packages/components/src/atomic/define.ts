import { declareComponent, declareProps, h } from '@wakeadmin/h';
import { shallowReactive, watch, set as $set } from '@wakeadmin/demi';

import { Atomic, AtomicCommonProps } from './types';
import { FatConfigurable, useFatConfigurable } from '../fat-configurable';

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
  options: {
    name: string;
    globalConfigKey?: keyof FatConfigurable;
  }
): (props: P) => any {
  const Component = declareComponent({
    name: options.name,
    props: declareProps<{ properties: any }>(['properties']),
    setup(props) {
      const properties = shallowReactive<Record<string, any>>({});
      const globalProperties = useFatConfigurable();

      // 全局参数合并
      if (options.globalConfigKey) {
        watch(
          () => (globalProperties as Record<string, any>)[options.globalConfigKey!],
          g => {
            if (g == null || typeof g !== 'object') {
              return;
            }

            for (const key in g) {
              const value = g[key];
              // 已在 props 中定义，跳过
              if (key in props.properties && props.properties[key] !== undefined) {
                continue;
              }

              if (properties[key] === value) {
                continue;
              }

              $set(properties, key, value);
            }
          },
          { immediate: true }
        );
      }

      watch(
        () => props.properties,
        p => {
          // 浅拷贝
          for (const key in p) {
            const value = p[key];
            if (key in properties) {
              if (properties[key] !== value && value !== undefined) {
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
