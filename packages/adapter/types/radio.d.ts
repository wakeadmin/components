export interface RadioCommonProps {
  /** The form input value */
  // vue2 v-model
  value?: string | number | boolean;
  onInput?: (value: string | number | boolean) => void;
  onChange?: (value: string | number | boolean) => void;
  // vue3 v-model
  modelValue?: string | number | boolean;
  'onUpdate:modelValue'?: (value: string | number | boolean) => void;
}

/** Radio Component */
export interface RadioProps extends RadioCommonProps {
  /** The value of radio */
  label?: string | number | boolean;

  /** Whether radio is disabled */
  disabled?: boolean;

  /** Whether to add a border around Radio */
  border?: boolean;

  /** Native 'name' attribute */
  name?: string;

  /** The size of radio  */
  size?: string;
}

export interface RadioButtonProps extends RadioCommonProps {
  /** The value of radio */
  label?: string | number;

  /** Whether radio is disabled */
  disabled?: boolean;

  /** Native 'name' attribute */
  name?: string;
}

/** Radio Group Component */
export interface RadioGroupProps extends RadioCommonProps {
  /** The size of radio buttons */
  size?: string;

  /** Border and background color when button is active */
  fill?: string;

  /** Whether the nesting radios are disabled */
  disabled?: boolean;

  /** Font color when button is active */
  textColor?: string;
}

export const Radio: (props: RadioProps) => any;
export const RadioButton: (props: RadioButtonProps) => any;
export const RadioGroup: (props: RadioGroupProps) => any;
