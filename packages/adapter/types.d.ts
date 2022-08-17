export type Size = 'small' | 'default' | 'large';

export function size(s: Size): string;
export function model<T>(value: T, onChange: (value: T) => void): any;

export const vLoading: any;

export type ClassValue = string | undefined | { [key: string]: any } | ClassValue[];
export type StyleValue = string | CSSProperties;

export interface CommonProps {
  class?: ClassValue;
  style?: StyleValue;
}

export interface ButtonProps {
  size?: string;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text';
  icon?: any;
  nativeType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingIcon?: any;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
  onClick?: ((evt: MouseEvent) => any) | undefined;
}
export const Button: (props: ButtonProps) => any;

export interface AlertProps {
  /** Title */
  title?: string;

  /** Component type */
  type?: 'success' | 'warning' | 'info' | 'error';

  /** Descriptive text. Can also be passed with the default slot */
  description?: string;

  /** If closable or not */
  closable?: boolean;

  /** whether to center the text */
  center?: boolean;

  /** Customized close button text */
  closeText?: string;

  /** If a type icon is displayed */
  showIcon?: boolean;

  /** Choose effect */
  effect?: AlertEffect;

  onClose?: () => void;
}

export const Alert: (props: AlertProps) => any;

export const Pagination: any;

export type SortOrder = 'ascending' | 'descending';

export type FilterList = { text: string; value: any }[];

export interface Sort {
  prop: string;
  order: SortOrder;
  init?: any;
  silent?: any;
}

export interface TableProps {
  data?: any[];
  size?: string;
  width?: string | number;
  height?: string | number;
  maxHeight?: string | number;
  fit?: boolean;
  stripe?: boolean;
  border?: boolean;
  rowKey?: string | ((row: any) => string);
  showHeader?: boolean;
  showSummary?: boolean;
  sumText?: string;
  summaryMethod?: (data: { columns: any; data: any[] }) => string[];
  rowClassName?: ClassValue;
  rowStyle?: StyleValue;
  cellClassName?: ClassValue | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => ClassValue);
  cellStyle?: StyleValue | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => StyleValue);
  headerRowClassName?: ClassValue;
  headerRowStyle?: StyleValue;
  headerCellClassName?:
    | ClassValue
    | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => ClassValue);
  headerCellStyle?:
    | StyleValue
    | ((data: { row: any; rowIndex: number; column: any; columnIndex: number }) => StyleValue);

  highlightCurrentRow?: boolean;
  currentRowKey?: string | number;
  emptyText?: string;
  expandRowKeys?: any[];
  defaultExpandAll?: boolean;
  defaultSort?: Sort;
  tooltipEffect?: string;
  spanMethod?: (data: { row: any; rowIndex: number; column: any; columnIndex: number }) =>
    | number[]
    | {
        rowspan: number;
        colspan: number;
      }
    | undefined;
  selectOnIndeterminate?: boolean;
  indent?: number;
  treeProps?: any;
  lazy?: boolean;
  load?: (row: any, treeNode: any, resolve: (data: any[]) => void) => void;
  style?: StyleValue;
  className?: ClassValue;
  tableLayout?: 'auto' | 'fixed';
  scrollbarAlwaysOn?: boolean;
  flexible?: boolean;

  onSelect?: (...args: any[]) => any;
  onExpandChange?: (...args: any[]) => any;
  onCurrentChange?: (...args: any[]) => any;
  onSelectAll?: (...args: any[]) => any;
  onSelectionChange?: (...args: any[]) => any;
  onCellMouseEnter?: (...args: any[]) => any;
  onCellMouseLeave?: (...args: any[]) => any;
  onCellContextmenu?: (...args: any[]) => any;
  onCellClick?: (...args: any[]) => any;
  onCellDblclick?: (...args: any[]) => any;
  onRowClick?: (...args: any[]) => any;
  onRowContextmenu?: (...args: any[]) => any;
  onRowDblclick?: (...args: any[]) => any;
  onHeaderClick?: (...args: any[]) => any;
  onHeaderContextmenu?: (...args: any[]) => any;
  onSortChange?: (evt: { column?: any; prop?: string; order?: SortOrder }) => any;
  onFilterChange?: (...args: any[]) => any;
  onHeaderDragend?: (...args: any[]) => any;
}

export interface TableMethods {
  /** Clear selection. Might be useful when `reserve-selection` is on */
  clearSelection(): void;

  /**
   * Toggle or set if a certain row is selected
   *
   * @param row The row that is going to set its selected state
   * @param selected Whether the row is selected. The selected state will be toggled if not set
   */
  toggleRowSelection(row: nay, selected?: boolean): void;

  /**
   * Toggle or set all rows
   */
  toggleAllSelection(): void;

  /**
   * Set a certain row as selected
   *
   * @param row The row that is going to set as selected
   */
  setCurrentRow(row?: object): void;

  /**
   * Toggle or set if a certain row is expanded
   *
   * @param row The row that is going to set its expanded state
   * @param expanded Whether the row is expanded. The expanded state will be toggled if not set
   */
  toggleRowExpansion(row: any, expanded?: boolean): void;

  /** Clear sort status, reset the table to unsorted  */
  clearSort(): void;

  /** Clear filter, reset the table to unfiltered  */
  clearFilter(): void;

  /** Relayout the table, maybe needed when change the table or it's ancestors visibility */
  doLayout(): void;

  /** Sort Table manually */
  sort(prop: string, order: string): void;

  /** method for lazy load subtree data */
  load(row: object, treeNode: treeNode, resolve: Function): void;
}

export const Table: (props: TableProps) => any;

export interface TableColumnProps {
  type?: string;
  label?: string;
  className?: ClassValue;
  labelClassName?: ClassValue;
  prop?: string;
  width?: string | number;
  minWidth?: string | number;
  renderHeader?: (data: { column: any; $index: number }) => any;
  sortable?: boolean | string;
  sortMethod?: (a: any, b: any) => number;
  sortBy?: string | string[] | ((row: any, index: number) => string);
  resizable?: boolean;
  columnKey?: string;
  align?: string;
  headerAlign?: string;
  showTooltipWhenOverflow?: boolean;
  showOverflowTooltip?: boolean;
  fixed?: boolean | 'left' | 'right';
  formatter?: (row: any, column: any, cellValue: any, index: number) => any;
  selectable?: (row: any, index: number) => boolean;
  reserveSelection?: boolean;
  filterMethod?: (value: any, row: any, column: any) => boolean;
  filteredValue?: string[];
  filters?: FilterList;
  filterPlacement?: string;
  filterMultiple?: boolean;
  index?: number | ((index: number) => number);
  sortOrders?: ('ascending' | 'descending' | null)[];
}

export const TableColumn: (props: TableColumnProps) => any;

export interface DropdownProps {
  trigger?: 'focus' | 'hover' | 'click' | 'contextmenu';
  effect?: string;
  type?: ButtonProps['type'];
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  size?: string;
  splitButton?: boolean;
  hideOnClick?: boolean;
  showTimeout?: number;
  hideTimeout?: number;
  tabindex?: number;
  disabled?: boolean;

  onClick?: () => any;
  onVisibleChange?: (visible: any) => any;
  onCommand?: (command: any) => any;
}

export const Dropdown: (props: DropdownProps) => any;

export interface DropdownItemProps {
  command?: any;
  disabled?: boolean;
  divided?: boolean;
  icon?: any;
}

export const DropdownItem = (props: DropdownItemProps) => any;

export const DropdownMenu = (props: {}) => any;

export interface FormMethods {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: () => void;
}

export interface FormProps {
  model?: any;
  rules?: Record<string, any>;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: string;
  disabled?: string;
  validateOnRuleChange?: string;
  hideRequiredAsterisk?: boolean;
}

export const Form = (props: FormProps) => any;

export interface FormItemProps {
  label?: string;
  labelWidth?: string | number;
  prop?: string;
  required?: boolean;
  rules?: any[];
  error?: string;
  inlineMessage?: boolean;
  showMessage?: boolean;
  size?: string;
}
export const FormItem = (props: FormItemProps) => any;

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
  onClear?: () => void;
}

export const Input = (props: InputProps) => any;

export interface EmptyProps {
  image?: string;

  /* image size (width) */
  imageSize?: number;

  /* description */
  description?: string;
}
export const Empty = (props: EmptyProps) => any;
