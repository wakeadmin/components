import {
  FilterList,
  SortOrder,
  MessageBoxOptions,
  MessageOptions,
  TableProps,
  StyleValue,
  ClassValue,
  PaginationProps,
  TableMethods,
} from '@wakeadmin/component-adapter';

import { Atomic } from '../atomic';
import { FatFormItemProps, FatFormMethods, FatFormProps } from '../fat-form';

import { FatTableAction, FatTableActionsProps } from './table-actions';

export interface FatTableSort {
  prop: string;
  order: SortOrder;
}

export interface FatTableFilter {
  [prop: string]: any[];
}

/**
 * 表格查询参数
 */
export interface FatTableRequestParams<T, S> {
  /**
   * 分页信息
   */
  pagination: {
    pageSize: number;
    /**
     * 页码形式
     */
    page: number;
    /**
     * 偏移形式
     */
    offset: number;
  };

  /**
   * 排序
   */
  sort?: FatTableSort;

  /**
   * 查询字段
   */
  query?: S;

  /**
   * 过滤条件
   */
  filter?: FatTableFilter;

  /**
   * 当前列表
   */
  list: T[];
}

/**
 * 表格查询响应参数
 */
export interface FatTableRequestResponse<T> {
  list: T[];
  total: number;
}

/**
 * 表格方法、实例属性
 */
export interface FatTableMethods<T extends {}, S extends {}> {
  /**
   * 获取底层 el-table 实例
   */
  readonly tableRef: TableMethods | undefined;

  /**
   * 获取底层 el-form 实例
   */
  readonly formRef: FatFormMethods<S> | undefined;

  /**
   * 获取已选中的记录
   */
  readonly selected: T[];

  /**
   * 查询表单
   */
  readonly query: S;

  /**
   * 当前排序字段
   */
  readonly sort?: FatTableSort;

  /**
   * 过滤字段
   */
  readonly filter: FatTableFilter;

  /**
   * 是否加载中
   */
  readonly loading: boolean;

  /**
   * 错误信息
   */
  readonly error?: Error;

  /**
   * 分页状态
   */
  readonly pagination: PaginationState;

  /**
   * 当前页数据
   */
  list: T[];

  /**
   * 选中指定记录
   * @param items
   */
  select(...items: T[]): void;

  /**
   * 取消选中指定记录
   * @param items
   */
  unselect(...items: T[]): void;

  /**
   * 全选当前页面
   */
  selectAll(): void;

  /**
   * 取消全选
   */
  unselectAll(): void;

  /**
   * 删除指定记录
   * @param items
   */
  remove(...items: T[]): Promise<void>;

  /**
   * 删除选中项
   */
  removeSelected(): Promise<void>;

  /**
   * 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
   */
  doLayout(): void;

  /**
   * 跳转到指定页面
   */
  gotoPage(page: number): void;

  /**
   * 触发搜索, 会重置分页到首页
   */
  search(): void;

  /**
   * 刷新, 搜索参数、分页等不会变动
   */
  refresh(): void;

  /**
   * 重置到初始状态并重新加载
   */
  reset(): void;
}

export interface FatTableSlots<T extends {}, S extends {}> {
  /**
   * 渲染标题
   */
  renderTitle?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染导航区
   */
  renderNavBar?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染查询表单之前的区域
   */
  renderBeforeForm?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染在表单下的前部，用于注入自定义表单
   */
  renderFormHeading?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染在搜索、查询按钮之前
   */
  renderBeforeSubmit?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染在表单下的后部，即搜索、查询按钮之后
   */
  renderFormTrailing?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染查询表单之前的区域
   */
  renderAfterForm?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染工具栏
   */
  renderToolbar?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染自定义错误
   */
  renderError?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染表格前部，可以注入自定义列
   */
  renderTableHeading?: (table: FatTableMethods<T, S>) => any;

  /**
   * 空状态展示
   */
  renderEmpty?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染表格后部，可以注入自定义列
   */
  renderTableTrailing?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染底部工具栏
   */
  renderBottomToolbar?: (table: FatTableMethods<T, S>) => any;
}

/**
 * 表格事件
 */
export interface FatTableEvents<T> {
  /**
   * 表格加载完毕
   * @param list
   */
  onLoad?: (list: T[]) => void;

  /**
   * 加载失败
   * @param error
   */
  onError?: (error: Error) => void;

  /**
   * 表单重置
   */
  onReset?: () => void;

  /**
   * 查询缓存恢复
   * @param queryCache
   */
  onQueryCacheRestore?: (queryCache: QueryStateCache) => void;
}

/**
 * --------------- actions 类型特定参数 -----------------
 */
export interface FatTableColumnActions<T extends {}, S extends {}> {
  /**
   * 操作
   */
  actions?: (Omit<FatTableAction, 'onClick'> & {
    // 重载点击方法
    onClick: (
      table: FatTableMethods<T, S>,
      row: T,
      action: FatTableAction,
      index: number
    ) => void | boolean | undefined | Promise<boolean | undefined | void>;
  })[];

  /**
   * 最多显示多少个操作，默认 3
   */
  actionsMax?: number;

  /**
   * 操作按钮类型， 默认为 text
   */
  actionsType?: FatTableActionsProps['type'];

  /**
   * 操作按钮大小，默认为 default
   */
  actionsSize?: FatTableActionsProps['size'];

  /**
   * 操作栏 class
   */
  actionsClassName?: ClassValue;
  actionsStyle?: StyleValue;
}

export interface FatTableColumnForm<T extends {}, S extends {}> {
  // ---------------- 表单搜索特定参数  --------------------
  /**
   * 该字段是否开启表单搜索, 默认关闭
   * 如果值为 string, 将覆盖 prop 作为表单的字段名
   * 表单需要指定 valueType，由它来执行表单的渲染
   */
  queryable?: boolean | string;

  /**
   * 是否禁用表单
   */
  disabled?: boolean;

  /**
   * 表单项配置
   */
  formItemProps?: Omit<
    FatFormItemProps<S, any>,
    'prop' | 'initialValue' | 'valueType' | 'valueProps' | 'disabled' | 'mode' | 'label' | 'tooltip'
  >;

  /**
   * 自定义表单渲染
   * 注意，返回的 vnode 需要配置 key
   */
  renderFormItem?: (query: S, column: T) => any;

  /**
   * 表单的默认值
   * 如果指定了 prop，initialValue 的值将设置到 prop 中
   * 否则如何返回一个对象，将合并到 query 中作为初始值
   */
  initialValue?: any | (() => any);

  /**
   * 用于转换表单的数据，比如前端使用 dataRange 字段来表示时间范围，而后端需要的是 startTime、endTime
   * 那么就可以在这里设置转换规则。
   * 假设：
   *  prop 为  dataRange
   *  transform 返回的是 {startTime、endTime}
   *  最后的结果是 dataRange 会从 query 中移除，并且 startTime、endTime 会合并到 query 中
   *
   *  如果 transform 返回非对象的值，将被忽略，但是 dataRange 依旧会被移除, 你可以返回 false 来告诉 fat-table 不要移除原有的字段
   */
  transform?: (value: any) => any;

  /**
   * 表单的顺序, 默认为 1000
   * 值越小，越靠前
   */
  order?: number;
}

export interface FatTableColumnStyle {
  // --------------- 样式  -------------------
  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right';

  /**
   * 字段类名
   * 如果是 query 列（注意 queryable 不会加），将加载 el-form-item 上
   */
  className?: ClassValue;

  /**
   * 对应列的宽度
   */
  width?: string | number;

  /**
   * 对应列的最小宽度， 对应列的最小宽度， 与 width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列
   */
  minWidth?: string | number;

  /**
   * 列是否固定在左侧或者右侧。 true 表示固定在左侧
   */
  fixed?: true | 'left' | 'right';

  /**
   * 当内容过长被隐藏时显示 tooltip，默认 false
   */
  showOverflowTooltip?: boolean;

  /**
   * 对应列是否可以通过拖动改变宽度（需要在 el-table 上设置 border 属性为真）, 默认 true
   */
  resizable?: boolean;
}

export interface FatTableColumnFilter {
  // ------------- 过滤 --------------------

  /**
   * 是否支持过滤, 默认关闭
   */
  filterable?: FilterList;

  /**
   * 过滤是否支持多选, 默认 true
   */
  filterMultiple?: boolean;

  /**
   * 过滤默认已选中的值
   */
  filteredValue?: any[];
}

export interface FatTableColumnLabel<T extends {}, S extends {}> {
  // -------------- 标题 --------------
  /**
   * 文本标题
   */
  label?: string;

  /**
   * 标题类名
   */
  labelClassName?: ClassValue;

  /**
   * 自定义标题渲染
   */
  renderLabel?: (index: number, column: FatTableColumn<T, S>) => any;

  /**
   * 标题对齐
   */
  labelAlign?: 'left' | 'center' | 'right';

  /**
   * 在 label 之后展示一个 icon， hover 提示
   */
  tooltip?: any;
}

export interface FatTableColumnIndex {
  // --------------- index 类型特定参数  -------------------
  /**
   * 如果设置了 type=index，可以通过传递 index 属性来自定义索引
   */
  index?: number | ((index: number) => number);
}

export interface FatTableColumnSort {
  /**
   * 是否支持排序, 默认 false
   *
   * 可以配置默认排序， 但是仅支持一个字段配置默认排序
   *
   * 注意：目前仅支持后端接口排序
   */
  sortable?: boolean | SortOrder;
}

export interface FatTableColumnSelect<T> {
  // ---------------- selection 类型特定参数 ------------------------------------

  /**
   * 判断该行是否可以选择
   */
  selectable?: (row: T, index: number) => boolean;
}

/**
 * 列声明
 */
export interface FatTableColumn<
  T extends {},
  S extends {} = {},
  ValueType extends keyof AtomicProps | Atomic = keyof AtomicProps
> extends FatTableColumnActions<T, S>,
    FatTableColumnForm<T, S>,
    FatTableColumnStyle,
    FatTableColumnFilter,
    FatTableColumnLabel<T, S>,
    FatTableColumnIndex,
    FatTableColumnSort,
    FatTableColumnSelect<T> {
  /**
   * 列类型
   * index 索引
   * selection 选择器
   * expand 展开
   * actions 表单操作
   * query 纯表单字段, 该列不会出现在表格中
   * default 默认
   */
  type?: 'index' | 'selection' | 'expand' | 'actions' | 'default' | 'query';

  /**
   * 字段名
   * 当列类型为 表单字段、排序字段、筛选字段 时， prop 是必填的
   *
   * 对于表格字段，prop 是属性名。
   * 对于表单，支持属性路径, 例如 a.b
   */
  prop?: string;

  /**
   * 可选，用于唯一标记列
   */
  key?: string;

  /**
   * 手动从行数据中提取数据, 用于取代 prop 以实现复杂数据的提取和格式化
   */
  getter?: (row: T, index: number) => any;

  /**
   * 自定义单元格渲染
   */
  render?: (value: any, row: T, index: number) => any;

  /**
   * 字段原件类型, 默认为 text
   */
  valueType?: ValueType;

  /**
   * 字段选项
   */
  valueProps?: ValueType extends keyof AtomicProps
    ? AtomicProps[ValueType]
    : ValueType extends Atomic<any, infer B>
    ? B
    : Record<string, any>;
}

export interface FatTableRemove<T> {
  /**
   * 是否在行删除之后重新请求， 默认 true
   *
   * 如果设置为 false，将原地删除对应字段
   */
  requestOnRemoved?: boolean;

  /**
   * 行删除
   */
  remove?: (list: T[], ids: any[]) => Promise<void>;

  /**
   * 是否在删除之前弹出确认提示, 默认开启
   */
  confirmBeforeRemove?: boolean | MessageBoxOptions | ((list: T[], ids: any[]) => MessageBoxOptions);

  /**
   * 是否在删除成功后提示，默认开启
   */
  messageOnRemoved?: boolean | MessageOptions | ((list: T[], ids: any[]) => MessageOptions);

  /**
   * 是否在删除失败后提示，默认开启
   */
  messageOnRemoveFailed?: boolean | MessageOptions | ((list: T[], ids: any[], error: Error) => MessageOptions);
}

export interface FatTableQuery<T extends {}, S extends {}> {
  /**
   * 是否开启表单搜索, 默认开启
   */
  enableQuery?: boolean;

  /**
   * 是否缓存搜索状态(包括查询参数、分页、排序等信息), 默认开启
   * 注意，一个页面中，应该只有一个 fat-table 开启缓存，否则会冲突。
   * 这种情况，为了避免冲突，需要手动指定 namespace
   */
  enableCacheQuery?: boolean;

  /**
   * 缓存命名空间，用于避免在同一个页面中缓存键冲突
   */
  namespace?: string;
  /**
   * 是否在表单查询数据变更时重新请求，默认为 true
   * 可以通过 queryWatchDelay 调整 debounce 的时长
   */
  requestOnQueryChange?: boolean;

  /**
   * 用于 request 查询的额外参数，一旦变化会触发重新加载
   * 也可以用它来实现自定义查询表单。
   * query 将会合并到 request 参数的 query 字段中
   */
  query?: Partial<S>;

  /**
   * 表单初始值
   */
  initialQuery?: Partial<S> | (() => Partial<S>);

  /**
   * query 防抖时长，默认为 800ms
   */
  queryWatchDelay?: number;

  /**
   * 搜索表单属性
   */
  formProps?: Omit<FatFormProps<S>, 'submit' | 'initialValue'>;
}

export interface FatTableSelect<T> {
  /**
   * 是否开启选择模式， 默认关闭
   */
  enableSelect?: boolean;

  /**
   * 判断行是否可以选择
   */
  selectable?: (row: T, index: number) => boolean;
}

export interface FatTablePaginationProps
  extends Omit<PaginationProps, 'total' | 'pageCount' | 'currentPage' | 'onSizeChange' | 'onCurrentChange'> {
  className?: ClassValue;
  style?: StyleValue;
}

export interface FatTablePagination {
  /**
   * 是否开启分页展示, 默认开启
   */
  enablePagination?: boolean;

  /**
   * 分页配置
   */
  paginationProps?: FatTablePaginationProps;
}

/**
 * 原始 table 参数
 */
export type FatTableRawProps = Omit<TableProps, 'data' | 'rowKey' | 'defaultSort' | 'emptyText'>;

/**
 * fat-table 参数
 */
export interface FatTableProps<T extends {}, S extends {}>
  extends FatTableRemove<T>,
    FatTableQuery<T, S>,
    FatTableSelect<T>,
    FatTablePagination,
    FatTableRawProps,
    FatTableEvents<T>,
    FatTableSlots<T, S> {
  /**
   * 表格页布局
   * mapp 微前端
   * default 默认布局
   *
   * 也支持自定义
   */
  layout?: 'mapp' | 'default' | FatTableLayout;

  /**
   * 唯一 id, 用于获取唯一 id
   */
  rowKey?: string | ((row: T) => string | number);

  /**
   * 数据请求
   */
  request: (params: FatTableRequestParams<T, S>) => Promise<FatTableRequestResponse<T>>;

  /**
   * 是否在挂载时就进行请求, 默认为 true
   */
  requestOnMounted?: boolean;

  /**
   * 排序规则变动时重新请求, 默认为 true
   */
  requestOnSortChange?: boolean;

  /**
   * 过滤规则变动时重新请求, 默认为 true
   */
  requestOnFilterChange?: boolean;

  /**
   * 列声明
   */
  columns: FatTableColumn<T, S>[];

  /**
   * 是否显示 request 错误信息, 默认开启
   */
  enableErrorCapture?: boolean;

  /**
   * 无数据提示文案
   */
  emptyText?: string;

  /**
   * 标题
   */
  title?: string;

  // vue 内置，一般不需要显示配置，我们这里配置了主要是为了方便 defineFatTable
  class?: ClassValue;
  style?: StyleValue;
}

export interface PaginationState {
  total: number;
  current: number;
  pageSize: number;
}

/**
 * 查询状态缓存
 */
export interface QueryStateCache {
  query: any;
  pagination: PaginationState;
  sort?: FatTableSort | null;
  filter?: FatTableFilter;
}
/**
 * 表格页布局
 */
export type FatTableLayout = (slots: {
  /**
   * 根节点属性
   */
  rootProps: { class?: ClassValue; style?: StyleValue; [key: string]: unknown };

  /**
   * 渲染标题栏
   */
  renderTitle?: () => any;

  /**
   * 渲染导航栏
   */
  renderNavBar?: () => any;

  /**
   * 渲染查询表单
   */
  renderQuery?: () => any;

  /**
   * 渲染错误提示
   */
  renderError?: () => any;

  /**
   * 渲染工具栏
   */
  renderToolbar?: () => any;

  /**
   * 渲染表格
   */
  renderTable?: () => any;

  /**
   * 渲染底部工具栏
   */
  renderBottomToolbar?: () => any;

  /**
   * 渲染分页
   */
  renderPagination?: () => any;
}) => any;
