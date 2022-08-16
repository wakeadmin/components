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
  }
}
