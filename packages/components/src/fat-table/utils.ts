import { MessageBoxOptions, MessageOptions } from '@wakeadmin/element-adapter';
import { cloneDeep, merge, get, isPlainObject, set } from '@wakeadmin/utils';

import { Registry } from '../atomic';
import { unset } from '../utils';

import { FatTableColumn, LooseMessageBoxOptions, LooseMessageOptions } from './types';

export function createMessageBoxOptions<Args>(
  options: LooseMessageBoxOptions<Args>,
  defaultOptions: Partial<MessageBoxOptions>,
  args: Args
): MessageBoxOptions | undefined {
  if (options === false) {
    return undefined;
  }

  const clone = { ...defaultOptions };

  if (typeof options === 'string') {
    clone.message = options;
  }

  if (typeof options === 'function') {
    // @ts-expect-error
    Object.assign(clone, options.apply(null, args));
  } else if (options && typeof options === 'object') {
    Object.assign(clone, options);
  }

  return clone;
}

export function createMessageOptions<Args>(
  options: LooseMessageOptions<Args>,
  defaultOptions: Partial<MessageOptions>,
  args: Args
): MessageOptions | undefined {
  if (options === false) {
    return undefined;
  }

  const clone = { ...defaultOptions };

  if (typeof options === 'string') {
    clone.message = options;
  }

  if (typeof options === 'function') {
    // @ts-expect-error
    Object.assign(clone, options.apply(null, args));
  } else if (options && typeof options === 'object') {
    Object.assign(clone, options);
  }

  return clone as MessageOptions;
}

export function validateColumns(columns?: FatTableColumn<any>[]) {
  if (columns == null) {
    throw new Error(`[fat-table] 必须指定列`);
  }

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];

    if (column.sortable && !column.prop) {
      throw new Error(`[fat-table] 开启了排序的列(${column.label ?? i})必须配置 prop 字段`);
    }

    if (column.filterable && !column.prop) {
      throw new Error(`[fat-table] 开启了过滤的列(${column.label ?? i})必须配置 prop 字段`);
    }

    if ((column.type === 'query' || column.queryable) && column.renderFormItem == null) {
      if (column.prop == null && typeof column.queryable !== 'string') {
        throw new Error(`[fat-table] 表单列 (${column.label ?? i})必须配置 prop 或 queryable 字段`);
      }
    }
  }
}

export function isQueryable(column: FatTableColumn<any>): boolean {
  return !!(column.type === 'query' || column.queryable);
}

/**
 * 查询参数处理
 * @param query
 * @param extraQuery
 * @param columns
 */
export function mergeAndTransformQuery(query: any, extraQuery: any, columns: FatTableColumn<any>[]) {
  const q = query ? cloneDeep(query) : {};

  // 合并外部参数
  if (extraQuery != null && typeof extraQuery === 'object') {
    merge(q, extraQuery);
  }

  // 转换
  for (const column of columns) {
    if (isQueryable(column) && column.prop != null && typeof column.transform === 'function') {
      const value = get(q, column.prop);
      const result = column.transform(value, query, column.prop);

      if (isPlainObject(result)) {
        // 移除原有字段
        unset(q, column.prop);

        for (const key in result) {
          set(q, key, (result as any)[key]);
        }
      } else {
        set(q, column.prop, result);
      }
    }
  }

  return q;
}

/**
 * 获取列唯一的 key
 * @param column
 * @param index
 * @returns
 */
export function genKey(column: FatTableColumn<any>, index: number): string {
  return column.key ?? `${String(column.prop)}_${index}`;
}

/**
 * 获取原件
 * @param column
 * @returns
 */
export const getAtom = (column: FatTableColumn<any>, registry: Registry) => {
  const valueType = column.valueType ?? 'text';

  // 按照 valueType 渲染
  const atom = typeof valueType === 'object' ? valueType : registry.registered(valueType);

  if (atom == null) {
    throw new Error(`[fat-table] 未能识别类型为 ${valueType} 的原件`);
  }

  return {
    comp: atom.component,
    validate: atom.validate,
  };
};
