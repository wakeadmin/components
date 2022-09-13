export declare type GetDisabledHours = (role: string, comparingDate?: any) => number[];
export declare type GetDisabledMinutes = (hour: number, role: string, comparingDate?: any) => number[];
export declare type GetDisabledSeconds = (hour: number, minute: number, role: string, comparingDate?: any) => number[];

export type TimePickerValue = string | Date | string[] | Date[];

/** TimePicker Component */
export interface TimePickerProps {
  /** Value of the picker */
  // vue 2 v-model
  value?: TimePickerValue;
  onInput?: (value?: TimePickerValue) => void;

  // vue 3 v-model
  modelValue?: TimePickerValue;
  'onUpdate:modelValue'?: (value?: TimePickerValue) => void;

  defaultValue?: TimePickerValue;

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

  /** Placeholder for the start time in range mode */
  startPlaceholder?: string;

  /** Placeholder for the end time in range mode */
  endPlaceholder?: string;

  /** Whether to pick a time range */
  isRange?: boolean;

  /** Alignment */
  align?: 'left' | 'center' | 'right';

  /** Custom class name for TimePicker's dropdown */
  popperClass?: string;

  /** Additional options, check the table below */
  // vue2 only
  pickerOptions?: any;

  /** Range separator */
  rangeSeparator?: string;

  id?: string;
  name?: string;

  // vue 2
  /**
   * Available time range.
   * e.g. `'18:30:00 - 20:30:00'`
   * or `['09:30:00 - 12:00:00', '14:30:00 - 18:30:00']`
   */
  selectableRange?: string | string[];

  // vue 3

  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;

  /** Format  of the picker */
  valueFormat?: string;
  format?: string;
}

export const TimePicker: (props: TimePickerProps) => any;
