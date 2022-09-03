/** InputNumber Component */
export interface InputNumberProps {
  /** Binding value */
  // vue2 v-model
  value?: number;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;

  // vue 3 v-model
  modelValue?: number;
  'onUpdate:modelValue'?: (value: number) => void;

  /** The minimum allowed value */
  min?: number;

  /** The maximum allowed value */
  max?: number;

  /** Incremental step */
  step?: number;

  /** whether input value can only be multiple of step */
  stepStrictly?: boolean;

  /** Size of the component */
  size?: string;

  /** Whether the component is disabled */
  disabled?: boolean;

  /** Whether to enable the control buttons */
  controls?: boolean;

  /** Debounce delay when typing, in milliseconds */
  debounce?: number;

  /** Position of the control buttons */
  controlsPosition?: string;

  /** Same as name in native input */
  name?: string;

  /** Precision of input value */
  precision?: number;

  label?: string;

  placeholder?: string;

  onFocus?: () => void;
  onBlur?: () => void;
}

export const InputNumber: (props: InputNumberProps) => any;
