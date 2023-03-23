import { ref } from '@wakeadmin/demi';

export function useTrigger() {
  const r = ref(0);
  return {
    track: () => r.value,
    trigger: () => r.value++,
  };
}
