import { isVue2, set as $set, isReactive, del as $del } from '@wakeadmin/demi';
import { set, get } from '@wakeadmin/utils';
import deepmerge from 'deepmerge';

import toPath from 'lodash/toPath';
import has from 'lodash/has';
import m from 'lodash/merge';
import { isDev } from './isDev';

export const merge: typeof m = (...args: any[]) => {
  return deepmerge.all(args, {
    arrayMerge: (destinationArray, sourceArray, options) => sourceArray,
  });
};

/**
 * 筛选可枚举的值
 * @param value
 * @returns
 */
export function pickEnumerable<T extends {}>(value: T, ...omits: string[]): T {
  return Object.keys(value).reduce<any>((prev, cur) => {
    // 支持忽略
    if (omits.includes(cur)) {
      return prev;
    }

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
 * 移除指定路径的值
 *
 * @param target
 * @param key
 * @param remove
 * @returns
 */
export function unset(
  target: any,
  key: string,
  remove?: (object: any, key: string, defaultRemove: () => void) => void
) {
  if (target == null) {
    return true;
  }

  if (typeof target !== 'object') {
    if (isDev) {
      console.warn(`[wakeadmin/components] 不能unset 非对象值: `, target);
    }

    return true;
  }

  const path = toPath(key);
  const parent = path.length > 1 ? get(target, path.slice(0, -1)) : target;
  const deleteKey = path[path.length - 1];

  if (parent == null) {
    return true;
  }

  const defaultRemove = () => {
    // 数组使用 splice 删除
    if (Array.isArray(parent)) {
      const index = parseInt(deleteKey);
      if (Number.isNaN(index)) {
        if (isDev) {
          console.warn(
            `[wakeadmin/components] unset 失败，当对象为数组时， deleteKey 必须为数字(现在为 ${deleteKey}) `,
            parent
          );
        }
        return false;
      } else if (index >= parent.length || index < 0) {
        if (isDev) {
          console.warn(
            `[wakeadmin/components] unset 失败，当对象为数组时， deleteKey(${index}) 超出数组长度范围 `,
            parent
          );
        }
        return false;
      }

      return !!parent.splice(index, 1).length;
    } else {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      return delete parent[deleteKey];
    }
  };
  if (remove) {
    // 自定义删除操作
    return remove(parent, deleteKey, defaultRemove);
  } else {
    return defaultRemove();
  }
}

/**
 * 兼容 vue 2 的 unset 实现
 */
export function reactiveUnset(target: any, key: string) {
  return unset(target, key, (parent, p, defaultRemove) => {
    if (!Array.isArray(parent)) {
      // 非数组
      $del(parent, p);
      return true;
    } else {
      return defaultRemove();
    }
  });
}
