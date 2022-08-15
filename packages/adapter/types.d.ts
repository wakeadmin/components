export function size(s: 'small' | 'default' | 'large'): string;

// TODO: 详细类型信息
export const Button: any;
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
