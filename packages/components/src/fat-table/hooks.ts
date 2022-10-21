import { ref } from '@wakeadmin/demi';
import { FatTableMethods } from './types';

/**
 * fat-table 实例引用
 * @returns
 */
export function useFatTableRef<T extends {} = any, S extends {} = any>() {
  return ref<FatTableMethods<T, S>>();
}
