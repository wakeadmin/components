import { getCurrentInstance, isVue2, set as $set, isReactive } from '@wakeadmin/demi';
import { LooseClassValue, ClassValue, LooseStyleValue, StyleValue } from '@wakeadmin/component-adapter';
import { NoopObject, omit, upperFirst, set, isPlainObject } from '@wakeadmin/utils';
import toPath from 'lodash/toPath';
import has from 'lodash/has';

export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}

export function normalizeClassName(...list: LooseClassValue[]) {
  return list.filter(i => (Array.isArray(i) ? i.length : i)).flat() as ClassValue;
}

export function normalizeStyle(...list: LooseStyleValue[]) {
  return list.filter(i => (Array.isArray(i) ? i.length : i)).flat() as StyleValue[];
}

/**
 * 是否存在事件订阅者
 * note: 不支持修饰符
 * @param name
 * @returns
 */
export function hasListener(name: string, instance?: any) {
  instance ??= getCurrentInstance()?.proxy;

  if (isVue2) {
    return name in (instance?.$listeners ?? NoopObject);
  } else {
    return `on${upperFirst(name)}` in (instance?.$attrs ?? NoopObject);
  }
}

export type TrimOnPrefix<K extends string> = K extends `on${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

export type TrimRenderPrefix<K extends string> = K extends `render${infer E}`
  ? E extends `${infer F}${infer L}`
    ? `${Lowercase<F>}${L}`
    : E
  : K;

export type TrimOnEvents<T extends {}> = {
  [K in keyof T as TrimOnPrefix<string & K>]: T[K];
};

/**
 * 将 on* 类型的事件转换为 h 库的 emit 类型格式
 */
export type ToHEmitDefinition<T> = TrimOnEvents<Required<T>>;

export type TrimRenderFunction<T extends {}> = {
  [K in keyof T as TrimRenderPrefix<string & K>]: T[K] extends () => any
    ? any
    : T[K] extends (a: infer R, ...args: any[]) => any
    ? R
    : never;
};

/**
 * 将 render* 类型的渲染函数转换未 h 库的 slot 类型格式
 */
export type ToHSlotDefinition<T> = TrimRenderFunction<Required<T>>;

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

/**
 * 判断是否声明了 slots
 */
export function hasSlots(props: any, slots: any, name: string) {
  return typeof props[`render${upperFirst(name)}`] === 'function' || typeof slots[name] === 'function';
}

function safeCall(fn: any, args: any[]) {
  if (fn == null) {
    return;
  }

  if (typeof fn !== 'function' && process.env.NODE_ENV !== 'production') {
    throw new Error(`[@wakeadmin/components] 期望接收到的是函数，当前为 ${typeof fn}`);
  }

  // eslint-disable-next-line consistent-return
  return fn.apply(null, args);
}

/**
 * 渲染 slot
 * @param props
 * @param slots
 * @param name
 * @param args
 * @returns
 */
export function renderSlot(props: any, slots: any, name: string, ...args: any[]) {
  const renderFn = props[`render${upperFirst(name)}`];
  const slot = slots[name];

  return renderFn && slot
    ? [safeCall(renderFn, args), safeCall(slot, args)]
    : slot != null
    ? safeCall(slot, args)
    : safeCall(renderFn, args);
}

/**
 * 筛选可枚举的值
 * @param value
 * @returns
 */
export function pickEnumerable<T extends {}>(value: T): T {
  return Object.keys(value).reduce<any>((prev, cur) => {
    prev[cur] = (value as any)[cur];

    return prev;
  }, {});
}

/**
 * 规范化对象路径
 * @param p
 * @returns
 */
export function normalizeKeyPath(p: string) {
  return toPath(p).join('.');
}

function isNumeric(str: string) {
  return !isNaN(parseFloat(str));
}

/**
 * 通过路径设置, 适用于 vue2。
 *
 * fork from https://github.com/kouts/vue-set-path/blob/main/src/vueSetPath.js
 *
 * @param target
 * @param key
 * @param value
 */
export function setByPath(target: any, key: string, value: any) {
  if (!isVue2) {
    set(target, key, value);
  }

  const path = toPath(key);

  const length = path.length;
  const lastIndex = length - 1;

  for (let index = 0; index < length; index++) {
    const prop = path[index];

    // If we are not on the last index
    // we start building the data object from the path
    if (index !== lastIndex) {
      const objValue = target[prop];

      // If objValue exists, is not primitive and is not observable, then make it so using Vue.set
      if (objValue && typeof objValue === 'object') {
        if (!isReactive(objValue)) {
          $set(target, prop, objValue);
        }
        // Array to object transformation
        // Check if parent path is an array, we are not on the last item
        // and the next key in the path is not a number
        if (Array.isArray(objValue) && !isNumeric(path[index + 1])) {
          $set(target, prop, {});
        }
      } else {
        // Create an empty object or an empty array based on the next path entry
        if (isNumeric(path[index + 1])) {
          $set(target, prop, []);
        } else {
          $set(target, prop, {});
        }
      }
    } else {
      // If we are on the last index then we just assign the the value to the data object
      // Note: If we used obj[prop] = value; arrays wouldn't be updated.
      $set(target, prop, value);
    }

    target = target[prop];
  }
}

/**
 * Object.assign 实现, 支持 vue 2 key
 */
export function reactiveAssign(target: any, source: any) {
  if (!isVue2) {
    Object.assign(target, source);
    return;
  }

  for (const key in source) {
    if (key in target) {
      target[key] = source[key];
    } else {
      $set(target, key, source[key]);
    }
  }
}

/**
 * 判断指定路径是否存在
 *
 * @param target
 * @param key
 * @returns
 */
export function hasByPath(target: any, key: string) {
  return has(target, key);
}

/**
 * 符合 atom 参数
 * @param builtinProps
 * @param userProps
 */
export function composeAtomProps(builtinProps: Record<string, any>, userProps?: Record<string, any>) {
  if (userProps == null || !isPlainObject(userProps)) {
    return builtinProps;
  }

  const keys = Object.keys(userProps);
  if (keys.length === 0) {
    return builtinProps;
  }

  for (const key of keys) {
    const value = (userProps as any)[key];
    if (!(key in builtinProps)) {
      // 直接写入
      builtinProps[key] = value;
      continue;
    }

    // 复合函数
    if (typeof value === 'function' && typeof builtinProps[key] === 'function') {
      const builtinValue = builtinProps[key];
      builtinProps[key] = function () {
        const rtn = builtinValue.apply(this, arguments);
        value.apply(this, arguments);

        return rtn;
      };
    } else {
      // 覆盖
      builtinProps[key] = value;
    }
  }

  return builtinProps;
}
