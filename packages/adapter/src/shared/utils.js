import { isVue2, computed } from '@wakeadmin/demi';

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
  if (s == null) {
    return s;
  }

  if (isVue2) {
    return ELEMENT_UI_SIZE_MAPPER[s];
  }

  return s;
}

/**
 * v-model 兼容
 * @deprecated 使用 useVModel
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

/**
 * @template T
 * @param {{ value: T, onChange: (value: T) => void }} props
 */
export function useVModel(props) {
  // 比对，避免重复触发 change
  const handleChange = value => {
    if (value === props.value) {
      return;
    }

    props.onChange?.(value);
  };

  return computed(() => {
    return model(props.value, handleChange);
  });
}
