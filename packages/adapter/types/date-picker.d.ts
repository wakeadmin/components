export type DatePickerType = 'year' | 'month' | 'date' | 'datetime' | 'week' | 'datetimerange' | 'daterange' | 'dates';
export type DatePickerFirstDayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Determine if `date` will be disabled in the picker
 *
 * @param date The date to check
 * @returns if `date` will be disabled in the picker
 */
export type DatePickerDisabledDateChecker = (date: Date) => boolean;

// Picked date range
export interface DatePickerDateRange {
  minDate: Date;
  maxDate: Date;
}

/**
 * Callback function that triggers when clicking on a shortcut.
 * You can change the picker value by emitting the pick event.
 * Example: `vm.$emit('pick', new Date())`
 */
export type DatePickerShortcutClickEventHandler = (vm: any) => void;

/** Shortcut options */
export interface DatePickerShortcut {
  /** Title of the shortcut */
  text: string;

  /** Callback function that triggers when picks a date range */
  onClick?: DatePickerShortcutClickEventHandler;
}

/** Options of el-date-picker */
export interface DatePickerOptions {}

export type DatePickerValue = Date | string | Date[] | string[];

/** DatePicker Component */
export interface DatePickerProps {
  /** The value of the date picker */
  value?: DatePickerValue;

  // vue3
  modelValue?: DatePickerValue;

  /** Whether DatePicker is read only */
  readonly?: boolean;

  /** Whether DatePicker is disabled */
  disabled?: boolean;

  /** Size of Input */
  size?: string;

  /** Whether the input is editable */
  editable?: boolean;

  /** Whether to show clear button */
  clearable?: boolean;

  /** Placeholder */
  placeholder?: string;

  /** Placeholder for the start date in range mode */
  startPlaceholder?: string;

  /** Placeholder for the end date in range mode */
  endPlaceholder?: string;

  /** Type of the picker */
  type?: DatePickerType;

  /** Format of the picker */
  format?: string;

  /** Alignment */
  align?: 'left' | 'center' | 'right';

  /** Custom class name for DatePicker's dropdown */
  popperClass?: string;

  // vue3 移除
  /** Additional options, check the table below */
  // pickerOptions: DatePickerOptions;

  /** Range separator */
  rangeSeparator?: string;

  /** Default date of the calendar */
  defaultValue?: Date | number | string;

  /** Default time of the calendar */
  defaultTime?: Date | string | [Date | string, Date | string];

  /** Format of binding value. If not specified, the binding value will be a Date object */
  valueFormat?: string;

  /** name for the inner native input */
  name?: string;

  // 从 pickerOptions 移入

  /** An object array to set shortcut options */
  shortcuts?: DatePickerShortcut[];

  /** A function determining if a date is disabled. */
  disabledDate?: DatePickerDisabledDateChecker;

  /** First day of week */
  firstDayOfWeek?: DatePickerFirstDayOfWeek;

  /** A callback that triggers when the seleted date is changed. Only for daterange and datetimerange. */
  // onPick?: PickEventHandler;

  // 事件

  // vue 3
  'onUpdate:modelValue'?: (value?: DatePickerValue) => void;
  // vue2
  onInput?: (value?: DatePickerValue) => void;
  onChange?: (value?: DatePickerValue) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export const DatePicker: (props: DatePickerProps) => any;
