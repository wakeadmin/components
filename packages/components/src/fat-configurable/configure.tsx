import { InjectionKey, inject, provide } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { merge, NoopObject } from '@wakeadmin/utils';

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
export function provideFatConfigurable(config: FatConfigurable) {
  provide(FatConfigureInjectKey, merge({}, DEFAULT_CONFIGURABLE, config));
}

/**
 * 配置注入 组件
 */
export const FatConfigurableProvider = declareComponent({
  name: 'FatConfigurableProvider',
  props: declareProps<{ value: FatConfigurable }>(['value']),
  setup(props, { slots }) {
    provideFatConfigurable(props.value ?? NoopObject);

    return () => {
      return slots.default?.();
    };
  },
});
