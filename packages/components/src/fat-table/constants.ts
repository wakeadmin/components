import { InjectionKey } from '@wakeadmin/demi';
import type { FatTableMethods } from './types';

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
  "getRequestParams",
  "getColumns"
];

/**
 * Fat-table instance 注入标识
 *
 * 允许开发者可以自行扩展fat-table
 */
export const FatTableInstanceContext: InjectionKey<FatTableMethods<any, any>> = Symbol('FatTableInstance');
