import { InjectionKey, inject, provide, computed, unref, watch, reactive, ref } from '@wakeadmin/demi';
import { declareComponent, declareProps, MaybeRef } from '@wakeadmin/h';
import { merge, NoopObject } from '@wakeadmin/utils';
import { setI18nInstance, defaultI18nInstance } from '../i18n';
import { assertPluginInstalled } from '../plugin';
import { isDev } from '../utils';

import { getDefaultConfigurable } from './default';
import { FatConfigurable } from './types';

const FatConfigureInjectKey = Symbol('fat-configure') as InjectionKey<FatConfigurable>;

const DEFAULT_CONFIGURABLE = getDefaultConfigurable(ref(defaultI18nInstance)).value;

/**
 * 配置获取 hooks
 * @returns
 */
export function useFatConfigurable() {
  // 检查插件是否安装
  if (isDev) {
    assertPluginInstalled();
  }

  return inject(FatConfigureInjectKey, DEFAULT_CONFIGURABLE);
}

/**
 * 配置注入 hooks
 * @param config
 */
export function provideFatConfigurable(config: MaybeRef<FatConfigurable>) {
  const i18n = ref(defaultI18nInstance);
  const defaultValue = getDefaultConfigurable(i18n);
  const value = reactive(defaultValue.value);

  watch(
    () => unref(config),
    nextValue => {
      // 这里允许传入一个null
      setI18nInstance(nextValue?.i18n);

      if (nextValue?.i18n && nextValue.i18n !== i18n.value) {
        i18n.value = nextValue.i18n;
      }

      merge(value, defaultValue.value, nextValue ?? NoopObject);
    },
    { deep: true, immediate: true }
  );

  // FIXME: 这里会报错:  Type instantiation is excessively deep and possibly infinite
  // 因此暂时断言为 any
  provide(FatConfigureInjectKey as any, value);
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
