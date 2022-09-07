import { InjectionKey, inject, provide, computed, unref, watch, reactive } from '@wakeadmin/demi';
import { declareComponent, declareProps, MaybeRef } from '@wakeadmin/h';
import { cloneDeep, merge } from '@wakeadmin/utils';

import { DEFAULT_CONFIGURABLE } from './default';
import { FatConfigurable } from './types';

const FatConfigureInjectKey = Symbol('fat-configure') as InjectionKey<FatConfigurable>;

/**
 * 配置获取 hooks
 * @returns
 */
export function useFatConfigurable() {
  return inject(FatConfigureInjectKey, DEFAULT_CONFIGURABLE);
}

/**
 * 配置注入 hooks
 * @param config
 */
export function provideFatConfigurable(config: MaybeRef<FatConfigurable>) {
  const value = reactive(cloneDeep(DEFAULT_CONFIGURABLE));

  watch(
    () => unref(config),
    nextValue => {
      if (nextValue) {
        merge(value, nextValue);
      }
    },
    { deep: true }
  );

  provide(FatConfigureInjectKey, value);
}

/**
 * 配置注入 组件
 */
export const FatConfigurableProvider = declareComponent({
  name: 'FatConfigurableProvider',
  props: declareProps<{ value: FatConfigurable }>(['value']),
  setup(props, { slots }) {
    provideFatConfigurable(computed(() => props.value));

    return () => {
      return slots.default?.();
    };
  },
});
