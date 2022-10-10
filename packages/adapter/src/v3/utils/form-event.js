import { formItemContextKey } from 'element-plus';
import { inject } from '@wakeadmin/demi';

/**
 * 触发 form-item 验证。用于自定义表单组件
 * @returns
 */
export function useFormItemValidate() {
  const formItem = inject(formItemContextKey, null);

  /**
   * @param {'change' | 'blur'} event
   */
  return function validate(event) {
    formItem?.validate?.(event).catch(() => {
      // ignored
    });
  };
}
