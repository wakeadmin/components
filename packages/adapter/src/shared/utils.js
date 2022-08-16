import { isVue2 } from '@wakeadmin/demi';

const ELEMENT_UI_SIZE_MAPPER = {
  large: 'default',
  default: 'medium',
  small: 'mini',
};

/**
 * 大小映射，以 element-plus 为标准
 * @param { 'small' | 'default' | 'large'} s
 */
export function size(s) {
  if (isVue2) {
    return ELEMENT_UI_SIZE_MAPPER[s];
  }

  return s;
}

/**
 * v-model 兼容
 */
export function model(value, onChange) {
  if (isVue2) {
    return {
      value,
      onInput: onChange,
    };
  } else {
    return {
      modelValue: value,
      'onUpdate:modelValue': onChange,
    };
  }
}
