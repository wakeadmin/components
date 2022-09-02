/** Checkbox Component */
export interface CheckboxProps {
  /** The form input value */
  // vue2 v-model
  value?: string | number | boolean;
  onInput?: (value: string | number | boolean) => void;

  // vue3 v-model
  modelValue?: string | number | boolean;
  'onUpdate:modelValue'?: (value: string | number | boolean) => void;

  onChange?: (value: string | number | boolean) => void;

  /** Value of the checkbox when used inside a checkbox-group */
  label?: string | number | boolean;

  /** Value of the checkbox if it's checked */
  trueLabel?: string | number;

  /** Value of the checkbox if it's not checked */
  falseLabel?: string | number;

  /** Native 'name' attribute */
  name?: string;

  /** Whether to add a border around Checkbox */
  border?: boolean;

  /** Size of the Checkbox, only works when border is true */
  size?: string;

  /** If the checkbox is disabled */
  disabled?: boolean;

  /** If the checkbox is checked */
  checked?: boolean;

  /** Same as indeterminate in native checkbox */
  indeterminate?: boolean;
}

export interface CheckboxGroupProps {
  // vue2 v-model
  value?: (string | number)[];
  onInput?: (value: (string | number)[]) => void;
  onChange?: (value: (string | number)[]) => void;

  // vue3 v-model
  modelValue?: (string | number)[];
  'onUpdate:modelValue'?: (value: (string | number)[]) => void;

  /** Size of checkbox buttons or bordered checkboxes */
  size?: string;

  /** Whether the nesting checkboxes are disabled */
  disabled?: boolean;

  /** Minimum number of checkbox checked */
  min?: number;

  /** Maximum number of checkbox checked */
  max?: number;

  /** Font color when button is active */
  textColor?: string;

  /** Border and background color when button is active */
  fill?: string;
}

/** Checkbox Button Component */
export interface CheckboxButtonProps {
  /** Value of the checkbox when used inside a checkbox-group */
  label?: string | number | boolean;

  /** Value of the checkbox if it's checked */
  trueLabel?: string | number;

  /** Value of the checkbox if it's not checked */
  falseLabel?: string | number;

  /** Native 'name' attribute */
  name?: string;

  /** If the checkbox is disabled */
  disabled?: boolean;

  /** If the checkbox is checked */
  checked?: boolean;
}

export const Checkbox: (props: CheckboxProps) => any;
export const CheckboxGroup: (props: CheckboxGroupProps) => any;
export const CheckboxButton: (props: CheckboxButtonProps) => any;
