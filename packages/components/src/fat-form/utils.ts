import { get, set, isPlainObject } from '@wakeadmin/utils';

import { unset } from '../utils';

import { PreDefinedItemWidth } from './constants';
import { FatFormItemMethods, FatFormItemWidth } from './types';

export function validateFormItemProps(props: { prop?: string }, name = 'fat-form-item') {
  if (props.prop == null) {
    throw new Error(`[${name}] 必须指定 prop 属性`);
  }
}

let modifyContext = 0;

/**
 * 是否在修改上下文下。主要用于判断是否是人为修改的表单数据
 * @returns
 */
export function isInModifyContext() {
  return !!modifyContext;
}

export function runInModifyContext(fn: () => void) {
  modifyContext++;

  fn();

  modifyContext--;
}

/**
 * 表单值转换
 * @param response
 * @param items
 */
export function convert(response: any, items: Set<FatFormItemMethods<any>>) {
  for (const item of items) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { atom, prop, convert } = item;
    const originalValue = get(response, prop);
    let value = originalValue;
    if (convert) {
      value = convert(value, response, prop);
    }

    if (atom.convert) {
      value = atom.convert(value);
    }

    if (value !== originalValue) {
      // 设置值
      set(response, prop, value);
    }
  }
}

export function transform(response: any, items: Set<FatFormItemMethods<any>>) {
  for (const item of items) {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    const { prop, transform } = item;
    if (transform == null) {
      continue;
    }

    const value = get(response, prop);
    const transformed = transform(value, response, prop);

    if (isPlainObject(transformed)) {
      // 移除原始字段
      unset(response, prop);

      for (const key in transformed) {
        set(response, key, (transformed as any)[key]);
      }
    } else {
      set(response, prop, transformed);
    }
  }
}

/**
 * 获取根属性
 */
export function pickRootField(prop: string) {
  return prop.split('.').filter(Boolean)?.[0];
}

export function formItemWidth(width: number | FatFormItemWidth) {
  if (typeof width === 'string' && width in PreDefinedItemWidth) {
    return PreDefinedItemWidth[width];
  }

  if (typeof width === 'number') {
    return `${width}px`;
  }

  return width;
}
