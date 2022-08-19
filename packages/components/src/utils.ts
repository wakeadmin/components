import { getCurrentInstance, isVue2 } from '@wakeadmin/demi';
import { LooseClassValue, ClassValue, LooseStyleValue, StyleValue } from '@wakeadmin/component-adapter';
import { NoopObject, omit } from '@wakeadmin/utils';

export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}

export function normalizeClassName(...list: LooseClassValue[]) {
  return list.filter(i => (Array.isArray(i) ? i.length : i)).flat() as ClassValue;
}

export function normalizeStyle(...list: LooseStyleValue[]) {
  return list.filter(i => (Array.isArray(i) ? i.length : i)).flat() as StyleValue[];
}

const CLASS_AND_STYLE = ['class', 'style'];

/**
 * 继承 props 和 listener
 * @param omitClassAndStyle 是否忽略class 和 style, 仅 vue3 下有效
 * @returns
 */
export function inheritProps(omitClassAndStyle = true) {
  const instance = getCurrentInstance()?.proxy;

  if (isVue2) {
    return {
      ...instance?.$attrs,
      // @ts-expect-error
      on: instance?.$listeners,
    };
  } else if (instance?.$attrs) {
    return omitClassAndStyle ? omit(instance?.$attrs, CLASS_AND_STYLE) : instance?.$attrs;
  }

  return NoopObject;
}
