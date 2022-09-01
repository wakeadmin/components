import { InjectionKey, inject, provide } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { merge, NoopObject } from '@wakeadmin/utils';

import { DEFAULT_CONFIGURABLE } from './default';

import { FatConfigurable } from './types';

const FatConfigureInjectKey = Symbol('fat-configure') as InjectionKey<FatConfigurable>;

export function useFatConfigurable() {
  return inject(FatConfigureInjectKey, DEFAULT_CONFIGURABLE);
}

export function provideFatConfigurable(config: FatConfigurable) {
  provide(FatConfigureInjectKey, config);
}

export const FatConfigurableProvider = declareComponent({
  name: 'FatConfigurableProvider',
  props: declareProps<{ value: FatConfigurable }>(['value']),
  setup(props, { slots }) {
    provideFatConfigurable(merge({}, DEFAULT_CONFIGURABLE, props.value ?? NoopObject));

    return () => {
      return slots.default?.();
    };
  },
});
