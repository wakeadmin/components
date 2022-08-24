import { cloneDeep, merge, get, isPlainObject } from '@wakeadmin/utils';

import { FatTableColumn } from './types';
import { Registry } from '../atomic';

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
      const result = column.transform(value);

      if (isPlainObject(result)) {
        // 处理合并
        merge(q, result);
      }

      if (result !== false) {
        // 移除原有字段
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete q[column.prop];
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
