import { Ref, watch, ref, onBeforeUnmount } from '@wakeadmin/demi';

/**
 * 延迟设置为 falsy 值
 *
 * @param value
 * @param delay
 * @returns
 */
export function useLazyFalsy<T>(value: Ref<T>, delay: number = 800) {
  const deferValue = ref<T>();
  let timer: number | undefined;

  deferValue.value = value.value;

  const clearTimer = () => {
    if (timer != null) {
      window.clearTimeout(timer);
      timer = undefined;
    }
  };

  watch(value, val => {
    clearTimer();

    if (val) {
      deferValue.value = val;
    } else {
      timer = window.setTimeout(() => {
        deferValue.value = val;
      }, delay);
    }
  });

  onBeforeUnmount(clearTimer);

  return deferValue;
}
