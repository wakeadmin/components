import { InjectionKey, inject, provide, Ref, computed, unref } from '@wakeadmin/demi';
import { declareComponent, declareProps, MaybeRef } from '@wakeadmin/h';
import { merge, NoopObject } from '@wakeadmin/utils';

import { staticRef } from '../utils';

import { DEFAULT_CONFIGURABLE } from './default';
import { FatConfigurable } from './types';

const FatConfigureInjectKey = Symbol('fat-configure') as InjectionKey<Ref<FatConfigurable>>;

/**
 * 配置获取 hooks
 * @returns
 */
export function useFatConfigurable() {
  return inject(FatConfigureInjectKey, staticRef(DEFAULT_CONFIGURABLE));
}

/**
 * 配置注入 hooks
 * @param config
 */
export function provideFatConfigurable(config: MaybeRef<FatConfigurable>) {
  const value = computed(() => {
    return merge({}, DEFAULT_CONFIGURABLE, unref(config));
  });

  provide(FatConfigureInjectKey, value);
}

/**
 * 配置注入 组件
 */
export const FatConfigurableProvider = declareComponent({
  name: 'FatConfigurableProvider',
  props: declareProps<{ value: FatConfigurable | (() => Ref<FatConfigurable>) }>(['value']),
  setup(props, { slots }) {
    provideFatConfigurable(unref(typeof props.value === 'function' ? props.value() : props.value) ?? NoopObject);

    return () => {
      return slots.default?.();
    };
  },
});
