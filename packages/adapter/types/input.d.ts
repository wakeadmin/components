/** The resizability of el-input component */
export type Resizability = 'none' | 'both' | 'horizontal' | 'vertical';
export type InputType = 'text' | 'textarea' | 'password';

/** Controls how el-input component automatically sets size */
export interface AutoSize {
  /** Minimum rows to show */
  minRows: number;

  /** Maximum rows to show */
  maxRows: number;
}

export interface InputProps {
  /** Type of input */
  type?: InputType;

  /** Binding value */
  value?: string;

  // vue 3
  modelValue?: string;

  /** Maximum Input text length */
  maxlength?: number;

  /** Minimum Input text length */
  minlength?: number;

  /** Placeholder of Input */
  placeholder?: string;

  /** Whether Input is disabled */
  disabled?: boolean;

  /** Size of Input, works when type is not 'textarea' */
  size?: string;

  /** Prefix icon class */
  prefixIcon?: any;

  /** Suffix icon class */
  suffixIcon?: any;

  /** Number of rows of textarea, only works when type is 'textarea' */
  rows?: number;

  /** Whether textarea has an adaptive height, only works when type is 'textarea' */
  autosize?: boolean | AutoSize;

  /** @Deprecated in next major version */
  autoComplete?: string;

  /** Same as autocomplete in native input */
  autocomplete?: string;

  /** Same as name in native input */
  name?: string;

  /** Same as readonly in native input */
  readonly?: boolean;

  /** Same as max in native input */
  max?: any;

  /** Same as min in native input */
  min?: any;

  /** Same as step in native input */
  step?: any;

  /** Control the resizability */
  resize?: Resizability;

  /** Same as autofocus in native input */
  autofocus?: boolean;

  /** Same as form in native input */
  form?: string;

  /** Whether to trigger form validatio */
  validateEvent?: boolean;

  /** Whether the input is clearable */
  clearable?: boolean;

  /** Whether to show password */
  showPassword?: boolean;

  /** Whether to show wordCount when setting maxLength */
  showWordLimit?: boolean;

  onBlur?: () => void;
  onFocus?: () => void;
  onChange?: (value: string) => void;
  onInput?: (value: string) => void;

  // vue 3
  'onUpdate:modelValue'?: (value: string) => void;

  onClear?: () => void;
}

export const Input = (props: InputProps) => any;
