import { MaybeRef } from '@wakeadmin/h';
import { computed, unref } from '@wakeadmin/demi';
import { isDev } from '../utils';

export function useUploadAccept(name: string, accept: MaybeRef<string | string[] | undefined>) {
  return computed<string | undefined>(() => {
    const value = unref(accept);

    if (Array.isArray(value)) {
      if (isDev) {
        // 检查是否为扩展名
        if (value.some(i => !i.startsWith('.'))) {
          throw new Error(`[wakeadmin/components] ${name} 需要传入扩展名数组，例如 [".png"]`);
        }
      }
      return value.join(',');
    }

    return value;
  });
}
