import { OptionProps, Message } from '@wakeadmin/component-adapter';
import { ref, watch } from '@wakeadmin/demi';

export function useOptions(props: { options?: OptionProps[] | (() => Promise<OptionProps[]>) }) {
  const loading = ref(false);
  const options = ref<OptionProps[]>([]);

  const load = async (loader: () => Promise<OptionProps[]>) => {
    const isGivenUp = () => loader !== props.options;

    try {
      loading.value = true;
      const results = await loader();

      if (!isGivenUp()) {
        options.value = results;
      }
    } catch (err) {
      console.error(err);
      Message.error(`下拉列表加载失败：${(err as Error).message}`);
    } finally {
      if (!isGivenUp()) {
        loading.value = false;
      }
    }
  };

  let stopWatch = watch(
    () => props.options,
    o => {
      if (typeof o === 'function') {
        load(o);
        // 只加载一次
        stopWatch();
      } else if (o) {
        options.value = o;
      }
    },
    { immediate: true }
  );

  return { loading, options };
}
