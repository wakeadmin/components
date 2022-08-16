import { FatTableColumn } from './types';

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

    if (column.type === 'query' || column.queryable) {
      if (column.prop == null && typeof column.queryable !== 'string') {
        throw new Error(`[fat-table] 表单列 (${column.label ?? i})必须配置 prop 或 queryable 字段`);
      }

      if (column.valueType == null) {
        throw new Error(`[fat-table] 表单列 (${column.label ?? i})必须配置 valueType 字段`);
      }
    }
  }
}

export function genKey(column: FatTableColumn<any>, index: number): string {
  return `${String(column.prop)}_${index}`;
}
