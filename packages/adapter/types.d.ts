export type Size = 'small' | 'default' | 'large';

export function size(s: Size): string;

// TODO: 详细类型信息

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

export const Alert: any;
export const Pagination: any;
export const Table: any;

export interface TableColumnProps {
  type?: string;
  label?: string;
  className?: string;
  labelClassName?: string;
  prop?: string;
  width?: string | number;
  minWidth?: string | number;
  renderHeader?: (data: { column: any; $index: number }) => any;
  sortable?: {
    type: (boolean | string)[];
    default: boolean;
  };
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
  filters?: { text: string; value: any }[];
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
