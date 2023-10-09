import { MaybeRef } from '@wakeadmin/h';
import { Ref, ref, unref, watch } from '@wakeadmin/demi';

export interface UsePromiseCacheState {
  result?: any;
  error?: Error;
  queue?: [(result: any) => void, (err: Error) => void][];
}

/**
 * TODO：避免全局缓存
 */
const globalCache = new Map<string, UsePromiseCacheState>();

/**
 * @experimental
 */
export function usePromise<T>(
  key: MaybeRef<string | null | undefined>,
  getter: (key: string) => Promise<T>,
  cache: Map<string, UsePromiseCacheState> = globalCache
): { result: Ref<T | undefined>; loading: Ref<boolean>; error: Ref<Error | undefined> } {
  let result = ref<T>();
  const loading = ref(false);
  const error = ref<Error>();

  watch(
    () => unref(key),
    k => {
      if (k == null) {
        return;
      }

      // TODO: 支持错误重试
      if (cache.has(k)) {
        const state = cache.get(k)!;

        if (state.queue != null) {
          // 请求中, 塞入队列
          loading.value = true;
          state.queue.push([
            res => {
              loading.value = false;
              result.value = res;
            },
            err => {
              loading.value = false;
              error.value = err;
            },
          ]);

          return;
        } else if (state.error == null) {
          result.value = state.result;
          return;
        }
        // 错误了, 需要重新请求
      }

      // 发起请求
      const promise = getter(k);

      loading.value = true;

      const state: UsePromiseCacheState = {
        queue: [
          [
            res => {
              loading.value = false;
              result.value = res;
            },
            err => {
              loading.value = false;
              error.value = err;
            },
          ],
        ],
        result: undefined,
        error: undefined,
      };

      cache.set(k, state);

      promise.then(
        res => {
          state.result = res;
          for (const [resolve] of state.queue!) {
            resolve(res);
          }
          state.queue = undefined;
        },
        err => {
          state.error = err;
          for (const [, reject] of state.queue!) {
            reject(err);
          }
          state.queue = undefined;
        }
      );
    },
    {
      immediate: true,
      flush: 'post',
    }
  );

  return {
    result,
    loading,
    error,
  };
}
