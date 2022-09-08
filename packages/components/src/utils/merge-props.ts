import { isVue2, getCurrentInstance } from '@wakeadmin/demi';

import { NoopObject, omit } from '@wakeadmin/utils';

import { normalizeClassName } from './className';
import { normalizeStyle } from './style';

const onRE = /^on[^a-z]/;
export const isOn = (key: string) => onRE.test(key);

export const isClass = (key: string) =>
  key === 'class' || key === 'className' || key.endsWith('ClassName') || key.endsWith('Class');

export const isStyle = (key: string) => key === 'style' || key.endsWith('Style');

const isVue2Property = (key: string) => key === 'attrs' || key === 'props' || key === 'domProps';
const isVue2Listener = (key: string) => key === 'on';

function mergeListeners(...args: any) {
  const ret: Record<string, any> = {};

  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];

    for (const key in toMerge) {
      const existing = ret[key];
      const incoming = toMerge[key];
      if (incoming && existing !== incoming && !(Array.isArray(existing) && existing.includes(incoming))) {
        ret[key] = existing ? [].concat(existing as any, incoming as any) : incoming;
      }
    }
  }

  return ret;
}

/**
 * 合并 props
 *
 * https://vuejs.org/api/render-function.html#mergeprops
 */
export function mergeProps(...args: any[]) {
  const ret: Record<string, any> = {};

  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (isClass(key)) {
        if (ret[key] !== toMerge[key]) {
          ret[key] = normalizeClassName(ret[key], toMerge[key]);
        }
      } else if (isStyle(key)) {
        ret[key] = normalizeStyle(ret[key], toMerge[key]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(Array.isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing as any, incoming as any) : incoming;
        }
      } else if (isVue2 && isVue2Property(key)) {
        // vue2 特殊的属性集合
        ret[key] = { ...ret[key], ...toMerge[key] };
      } else if (isVue2 && isVue2Listener(key)) {
        // vue2 事件处理器
        ret[key] = mergeListeners(ret[key], toMerge[key]);
      } else if (key !== '') {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}

const CLASS_AND_STYLE = ['class', 'style'];

/**
 * 继承 props 和 listener
 * @param omitClassAndStyle 是否忽略class 和 style, 仅 vue3 下有效, vue 2 下 class、style 会始终添加到根节点
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
