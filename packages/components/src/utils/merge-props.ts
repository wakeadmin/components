import { getCurrentInstance, isVue2 } from '@wakeadmin/demi';

import { isObject, NoopObject, omit, upperFirst } from '@wakeadmin/utils';

import { normalizeClassName } from './className';
import { camelize } from './string';
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
      } else if (key !== '' && key.includes('-')) {
        // 转换为 camelCase
        // vue template 中通常会使用 kebab-case
        ret[camelize(key)] = toMerge[key];
      } else if (key !== '') {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}

const EVENT_MODIFIER_PREFIX: Record<string, string> = {
  '!': 'Capture',
  '~': 'Once',
  '&': 'Passive',
};

export function transformEventListenerName(name: string) {
  const modifiers: string[] = [];

  let i = 0;
  for (; i < name.length; i++) {
    const char = name[i];
    if (char in EVENT_MODIFIER_PREFIX) {
      modifiers.push(EVENT_MODIFIER_PREFIX[char]);
    } else {
      break;
    }
  }

  const eventName = name.slice(i);

  return `on${upperFirst(eventName)}${modifiers.join('')}`;
}

/**
 * 获取组件订阅器。对于 vue 2，需要转换为正规的 onXXX 格式
 * @returns
 */
export function transformListeners() {
  if (!isVue2) {
    return NoopObject;
  }
  const instance = getCurrentInstance()?.proxy as any;

  if (instance == null || instance.$listeners == null) {
    return NoopObject;
  }

  const listeners: Record<string, any> = {};

  for (const key in instance.$listeners) {
    listeners[transformEventListenerName(key)] = instance.$listeners[key];
  }

  return listeners;
}

const CLASS_AND_STYLE = ['class', 'style'];

/**
 * 继承 props 和 listener
 * @param omitClassAndStyle 是否忽略class 和 style, 仅 vue3 下有效, vue 2 下 class、style 会始终添加到根节点, 默认为 true
 * @param instance 自定义 vue 实例，默认从 getCurrentInstance 中获取
 * @returns
 */
export function inheritProps(omitClassAndStyle = true, instance?: any) {
  instance ??= getCurrentInstance()?.proxy as any;

  if (instance == null) {
    return NoopObject;
  }

  if (isVue2) {
    const toForward: Record<string, unknown> = {};

    if (isObject(instance.$listeners) && Object.keys(instance.$listeners).length) {
      // 拷贝避免篡改影响父组件
      toForward.on = { ...instance?.$listeners };
    }

    if (isObject(instance.$attrs) && Object.keys(instance.$attrs).length) {
      Object.assign(toForward, instance.$attrs);
    }

    return toForward;
  } else if (instance?.$attrs) {
    return omitClassAndStyle ? omit(instance?.$attrs, CLASS_AND_STYLE) : instance?.$attrs;
  }

  return NoopObject;
}
