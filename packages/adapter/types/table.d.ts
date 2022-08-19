import { ClassValue, StyleValue } from './common';

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
  rowKey?: string | ((row: any) => string | number);
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
  toggleRowSelection(row: any, selected?: boolean): void;

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
  load(row: object, treeNode: any, resolve: Function): void;
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
