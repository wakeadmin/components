/** TimeSelect Component */
export interface TimeSelectProps {
  // vue2 v-model
  /** Value of the picker */
  value?: string | Date;
  onInput: (value?: string | Date) => void;

  // vue3 v-model
  modelValue?: string | Date;
  'onUpdate:modelValue': (value?: string | Date) => void;

  /** Whether DatePicker is read only */
  readonly?: boolean;

  /** Whether DatePicker is disabled */
  disabled?: boolean;

  /** Whether the input is editable */
  editable?: boolean;

  /** Whether to show clear button */
  clearable?: boolean;

  /** Size of Input */
  size?: string;

  /** Placeholder */
  placeholder?: string;

  /** Alignment */
  align?: 'left' | 'center' | 'right';

  /** Custom class name for TimePicker's dropdown */
  popperClass?: string;

  /** Additional options, check the table below */
  // vue2 only
  pickerOptions?: any;

  /** Start time */
  start?: string;

  /** End time */
  end?: string;

  /** Time step */
  step?: string;

  /** Minimum time, any time before this time will be disabled */
  minTime?: string;

  /** Maximum time, any time after this time will be disabled */
  maxTime?: string;

  // vue3 only
  format?: string;
}

export const TimeSelect: (props: TimeSelectProps) => any;
