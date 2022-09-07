import { ref } from '@wakeadmin/demi';
import { FatTableMethods } from './types';

/**
 * fat-table 实例引用
 * @returns
 */
export function useFatTableRef<T extends {}, S extends {}>() {
  return ref<FatTableMethods<T, S>>();
}
