import { FatTableMethods } from './types';

/**
 * fat-table 对外公开的实例成员
 */
export const FatTablePublicMethodKeys: (keyof FatTableMethods<any, any>)[] = [
  'tableRef',
  'formRef',
  'selected',
  'query',
  'sort',
  'filter',
  'loading',
  'error',
  'pagination',
  'list',
  'select',
  'unselect',
  'selectAll',
  'unselectAll',
  'remove',
  'removeSelected',
  'doLayout',
  'gotoPage',
  'search',
  'refresh',
  'reset',
];
