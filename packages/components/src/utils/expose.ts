import { Ref } from '@wakeadmin/demi';

/**
 * 转发子组件 expose 的值
 * @param expose
 */
export function forwardExpose(exposed: Record<string, unknown>, fields: string[], ref: Ref<any>) {
  for (const field of fields) {
    Object.defineProperty(exposed, field, {
      configurable: true,
      enumerable: true,
      get() {
        return ref.value?.[field];
      },
      set(value) {
        if (ref.value != null) {
          ref.value[field] = value;
        }
      },
    });
  }
}
