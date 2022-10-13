/** Switch Component */
export interface SwitchProps {
  /** Whether Switch is on */
  // vue2 v-model
  value?: boolean | string | number;
  onInput?: (value: boolean | string | number) => void;

  // vue3 v-model
  modelValue?: boolean | string | number;
  'onUpdate:modelValue'?: (value: boolean | string | number) => void;

  /** Whether Switch is disabled */
  disabled?: boolean;

  // 仅支持默认尺寸和 small
  size?: 'small';

  /** Width of Switch */
  width?: number | string;

  /* 无论图标或文本是否显示在点内，只会呈现文本的第一个字符 */
  inlinePrompt?: boolean;

  /* switch 状态为 on 时所显示图标，设置此项会忽略 active-text */
  activeIcon?: any;

  /** switch 状态为 off 时所显示图标，设置此项会忽略 inactive-text */
  inactiveIcon?: any;

  /** Text displayed when in on state */
  activeText?: string;

  /** Text displayed when in off state */
  inactiveText?: string;

  /** Background color when in on state */
  activeColor?: string;

  /** Background color when in off state */
  inactiveColor?: string;

  /** 开关的边框颜色 ( 已废弃，使用 CSS var --el-switch-border-color ) */
  borderColor?: string;

  /** Switch value when in on state */
  activeValue?: string | boolean | number;

  /** Switch value when in off state */
  inactiveValue?: string | boolean | number;

  /** Input name of Switch */
  name?: string;

  id?: string;

  tabIndex?: number | string;

  /** Whether to trigger form validation */
  validateEvent?: boolean;

  /** witch 状态改变前的钩子， 返回 false 或者返回 Promise 且被 reject 则停止切换  */
  beforeChange?: () => Promise<boolean> | boolean;
}

export const Switch: (props: SwitchProps) => any;
