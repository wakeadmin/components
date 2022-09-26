import { Message } from '@wakeadmin/element-adapter';
import { Ref, ref, unref, watch, nextTick } from '@wakeadmin/demi';
import { MaybeRef } from '@wakeadmin/h';

export function useLazyOptions<T>(options: MaybeRef<T | (() => Promise<T>) | undefined>, defaultValue: T) {
  const loading = ref(false);
  const value = ref<T>(defaultValue) as Ref<T>;

  const load = async (loader: () => Promise<T>) => {
    const isGivenUp = () => loader !== unref(options);

    try {
      loading.value = true;
      const results = await loader();

      if (!isGivenUp()) {
        value.value = results;
      }
    } catch (err) {
      console.error(err);
      Message.error(`选项加载失败：${(err as Error).message}`);
    } finally {
      if (!isGivenUp()) {
        loading.value = false;
      }
    }
  };

  let stopWatch = watch(
    () => unref(options),
    o => {
      if (typeof o === 'function') {
        load(o as () => Promise<T>);
        // 只加载一次
        nextTick(() => {
          stopWatch();
        });
      } else if (o) {
        value.value = o;
      }
    },
    { immediate: true }
  );

  return { loading, value };
}
