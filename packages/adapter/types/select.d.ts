export type QueryChangeHandler = (queryString: string) => void;

export interface SelectMethods {
  /**
   * Focus the Input component
   */
  focus(): void;

  /**
   * Blur the Input component, and hide the dropdown
   */
  blur(): void;
}

/** Dropdown Select Option Component */
export interface OptionProps {
  /** Value of option */
  value?: any;

  /** Label of option, same as value if omitted */
  label?: string;

  /** Whether option is disabled */
  disabled?: boolean;
}

export interface OptionGroupProps {
  /** Name of the group */
  label?: string;

  /** Whether to disable all options in this group */
  disabled?: boolean;
}

/** Dropdown Select Component */
export interface SelectProps {
  /** The form input value */
  // vue 2
  value?: any;
  onInput?: (value: any) => void;

  // vue 3
  modelValue?: any;
  'onUpdate:modelValue'?: (value: any) => void;

  /** Whether multiple-select is activated */
  multiple?: boolean;

  /** Whether Select is disabled */
  disabled?: boolean;

  /** Unique identity key name for value, required when value is an object */
  valueKey?: string;

  /** Size of Input */
  size?: string;

  /** Whether single select can be cleared */
  clearable?: boolean;

  collapseTags?: boolean;

  /** Maximum number of options user can select when multiple is true. No limit when set to 0 */
  multipleLimit?: number;

  /** Same as autocomplete in native input */
  autocomplete?: string;

  /** The name attribute of select input */
  name?: string;

  /** Placeholder */
  placeholder?: string;

  /** Whether Select is filterable */
  filterable?: boolean;

  /** Whether creating new items is allowed. To use this, filterable must be true */
  allowCreate?: boolean;

  /** Custom filter method */
  filterMethod?: QueryChangeHandler;

  /** Whether options are loaded from server */
  remote?: boolean;

  /** Custom remote search method */
  remoteMethod?: QueryChangeHandler;

  /** Whether Select is loading data from server */
  loading?: boolean;

  /** Displayed text while loading data from server */
  loadingText?: string;

  /** Displayed text when no data matches the filtering query */
  noMatchText?: string;

  /** Displayed text when there is no options */
  noDataText?: string;

  reserveKeyword?: boolean;

  /** Custom class name for Select's dropdown */
  popperClass?: string;

  /** Select first matching option on enter key. Use with filterable or remote */
  defaultFirstOption?: boolean;

  /** Whether to append the popper menu to body */
  popperAppendToBody?: boolean;

  automaticDropdown?: boolean;

  onClear?: () => void;
  onBlur?: () => void;
  onFocus?: () => void;
}

export const Select: (props: SelectProps) => any;
export const Option: (props: OptionProps) => any;
export const OptionGroup: (props: OptionGroupProps) => any;
