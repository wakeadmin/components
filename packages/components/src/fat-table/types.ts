import {
  FilterList,
  SortOrder,
  TableProps,
  StyleValue,
  ClassValue,
  PaginationProps,
  TableMethods,
  ButtonProps,
  CommonProps,
} from '@wakeadmin/element-adapter';

import { GetAtomicProps } from '../atomic';
import { FatFormItemProps, FatFormMethods, FatFormMode } from '../fat-form';
import { FatFormQueryProps } from '../fat-form-layout';

import { FatAction, FatActionsProps } from '../fat-actions';
import { LooseMessageBoxOptions, LooseMessageOptions } from '../utils';

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
export interface FatTableMethods<Item extends {}, Query extends {}> {
  /**
   * 获取底层 el-table 实例
   */
  readonly tableRef: TableMethods | undefined;

  /**
   * 获取底层 fat-form 实例
   */
  readonly formRef: FatFormMethods<Query> | undefined;

  /**
   * 获取已选中的记录
   */
  readonly selected: Item[];

  /**
   * 查询表单
   */
  readonly query: Query;

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
  loading: boolean;

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
  list: Item[];

  /**
   * 选中指定记录
   * @param items
   */
  select(...items: Item[]): void;

  /**
   * 取消选中指定记录
   * @param items
   */
  unselect(...items: Item[]): void;

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
   *
   * @param items
   */
  remove(...items: Item[]): Promise<void>;

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

  /**
   * 获取 request 参数
   */
  getRequestParams: () => FatTableRequestParams<Item, Query>;
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
   * 自定义提交按钮渲染
   */
  renderSubmitter?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染在搜索、查询按钮之后
   */
  renderAfterSubmit?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染在表单下的后部，即搜索、查询按钮之后。
   * 等价于 renderAfterSubmit
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
   * 插入到 table 之前
   */
  renderBeforeTable?: (table: FatTableMethods<T, S>) => any;

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
   * 插入到 table 之后
   */
  renderAfterTable?: (table: FatTableMethods<T, S>) => any;

  /**
   * 渲染底部工具栏
   */
  renderBottomToolbar?: (table: FatTableMethods<T, S>) => any;
}

/**
 * 表格事件
 */
export interface FatTableEvents<T, S> {
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

export type FatTableAction<T extends {}, S extends {}> = Omit<
  FatAction,
  'onClick' | 'confirm' | 'visible' | 'disabled' | 'title'
> & {
  visible?: boolean | ((table: FatTableMethods<T, S>, row: T, action: FatTableAction<T, S>, index: number) => boolean);
  title?: string | ((table: FatTableMethods<T, S>, row: T, action: FatTableAction<T, S>, index: number) => string);
  disabled?: boolean | ((table: FatTableMethods<T, S>, row: T, action: FatTableAction<T, S>, index: number) => boolean);
  /**
   * 提示信息
   */
  confirm?: LooseMessageBoxOptions<{
    action: FatTableAction<T, S>;
    table: FatTableMethods<T, S>;
    row: T;
    index: number;
  }>;

  /**
   * 点击事件, link 类型默认会打开路由, 可以返回 false 来阻止默认行为
   */
  onClick?: (
    table: FatTableMethods<T, S>,
    row: T,
    action: FatTableAction<T, S>,
    index: number
  ) => void | boolean | Promise<boolean | void>;
};

/**
 * 批量操作按钮
 */
export interface FatTableBatchAction<T extends {}, S extends {}> {
  /**
   * 未选择情况下禁用按钮, 默认 true
   */
  disabledUnselected?: boolean;

  /**
   * 可视状态, 默认 true
   */
  visible?: boolean;

  /**
   * 禁用状态, 默认 false
   */
  disabled?: boolean;

  /**
   * 确认消息
   */
  confirm?: LooseMessageBoxOptions<{
    table: FatTableMethods<T, S>;
  }>;

  /**
   * 点击
   */
  onClick?: (table: FatTableMethods<T, S>) => void;

  /**
   * 文案提示
   */
  title?: string;

  /**
   * 自定义样式
   */
  style?: StyleValue;

  /**
   * 自定义类名
   */
  className?: ClassValue;

  /**
   * 文案
   */
  name: any;

  /**
   * 额外按钮属性
   */
  buttonProps?: ButtonProps;

  /**
   * 受控显示加载状态
   *
   * 如果 onClick 返回 Promise，FatActions 也会为该 Promise 维护 loading 状态
   */
  loading?: boolean;
}

/**
 * --------------- actions 类型特定参数 -----------------
 */
export interface FatTableColumnActions<T extends {}, S extends {}> {
  /**
   * 操作
   */
  actions?: FatTableAction<T, S>[] | ((table: FatTableMethods<T, S>, row: T, index: number) => FatTableAction<T, S>[]);

  /**
   * 最多显示多少个操作，默认 3
   */
  actionsMax?: number;

  /**
   * 操作按钮类型， 默认为 text
   */
  actionsType?: FatActionsProps['type'];

  /**
   * 操作按钮大小，默认为 default
   */
  actionsSize?: FatActionsProps['size'];

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
   * 表单需要指定 valueType，由它来执行表单的渲染, 如果未指定，默认为 text
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
    FatFormItemProps<S, S, any>,
    | 'prop'
    | 'initialValue'
    | 'valueType'
    | 'valueProps'
    | 'disabled'
    | 'mode'
    | 'label'
    | 'tooltip'
    | 'valueClassName'
    | 'valueStyle'
    | 'convert'
    | 'transform'
  > &
    CommonProps;

  /**
   * 自定义表单渲染
   * 注意，返回的 vnode 需要配置 key
   */
  renderFormItem?: (query: S, column: T) => any;

  /**
   * 表单的默认值
   */
  initialValue?: any;

  /**
   * 用于转换表单的数据，比如前端使用 dataRange 字段来表示时间范围，而后端需要的是 startTime、endTime
   * 那么就可以在这里设置转换规则。
   *
   * 如果返回一个对象，key 为新属性的 path, 例如 {'a.b': 0, 'a.c': 2, 'a.d[0]': 3}, 同时原本的字段会被移除
   * 如果 transform 返回非对象的值，将作为当前字段的值
   *
   * 假设：
   *  prop 为  dataRange
   *  transform 返回的是 {startTime、endTime}
   *  最后的结果是 dataRange 会从 query 中移除，并且 startTime、endTime 会合并到 query 中
   *
   * 如果需要更灵活的转换，可以在 request 中处理
   */
  transform?: (value: any, query: S, prop: string) => any;

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
   * 对应列的最小宽度，  width 的区别是 width 是固定的，min-width 会把剩余宽度按比例分配给设置了 min-width 的列
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

  /**
   * 原件类名
   */
  valueClassName?: ClassValue;

  /**
   * 原件内联样式
   */
  valueStyle?: StyleValue;
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

export type LabelAlign = 'left' | 'center' | 'right';

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
  labelAlign?: LabelAlign;

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
  ValueType extends keyof AtomicProps = keyof AtomicProps
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
   * 支持属性路径, 例如 a.b
   */
  prop?: string;

  /**
   * 可选，用于唯一标记列
   */
  key?: string;

  /**
   * 手动从行数据中提取单元格数据, 用于取代 prop 以实现复杂数据的提取和格式化
   */
  getter?: (row: T, index: number) => any;

  /**
   * 和 setter 对应，如果开启了编辑态的原件（通过 columnMode），想要执行数据修改，可以提供对应的 setter
   */
  setter?: (newValue: any, row: T, index: number) => any;

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
   * 支持传入一个函数，不过仅在单元格渲染时才支持 row 和 index 参数, 用于表单时为空
   */
  valueProps?: GetAtomicProps<ValueType> | ((row?: T, index?: number) => GetAtomicProps<ValueType>);

  /**
   * 列的表单模式。 默认情况下是 preview
   */
  columnMode?: FatFormMode;
}

export interface FatTableRemove<T> {
  /**
   * 是否在行删除之后重新请求， 默认 true
   *
   * 如果设置为 false，将原地删除对应行
   */
  requestOnRemoved?: boolean;

  /**
   * 行删除
   */
  remove?: (list: T[], ids: any[]) => Promise<void>;

  /**
   * 是否在删除之前弹出确认提示, 默认开启
   */
  confirmBeforeRemove?: LooseMessageBoxOptions<{ items: T[]; ids: any[] }>;

  /**
   * 是否在删除成功后提示，默认开启
   */
  messageOnRemoved?: LooseMessageOptions<{ items: T[]; ids: any[] }>;

  /**
   * 是否在删除失败后提示，默认开启
   */
  messageOnRemoveFailed?: LooseMessageOptions<{ items: T[]; ids: any[]; error: Error }>;
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
   * 是否在表单查询数据变更时重新请求，默认为 false
   * 可以通过 queryWatchDelay 调整 debounce 的时长
   */
  requestOnQueryChange?: boolean;

  /**
   * 是否在 extraQuery 变更时重新请求，默认为 false
   *
   * requestOnQueryChange 会同时监听 query 和 extraQuery
   * requestOnExtraQueryChange 只会监听 extraQuery
   */
  requestOnExtraQueryChange?: boolean;

  /**
   * 用于 request 查询的额外参数，一旦变化会触发重新加载(需开启 requestOnQueryChange)
   * 也可以用它来实现自定义查询表单。
   * query 将会合并到 request 参数的 query 字段中
   */
  extraQuery?: Partial<S>;

  /**
   * 表单初始值
   */
  initialQuery?: Partial<S>;

  /**
   * query 防抖时长，默认为 800ms
   */
  queryWatchDelay?: number;

  /**
   * 搜索表单属性
   */
  formProps?: Omit<FatFormQueryProps<S>, 'submit' | 'initialValue' | 'submitOnQueryChange'>;
}

interface FatTableSelect<T> {
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
export interface FatTableProps<Item extends {}, Query extends {}>
  extends FatTableRemove<Item>,
    FatTableQuery<Item, Query>,
    FatTableSelect<Item>,
    FatTablePagination,
    FatTableRawProps,
    FatTableEvents<Item, Query>,
    FatTableSlots<Item, Query> {
  /**
   * 表格页布局
   * default  惟客云默认布局
   *
   * 也支持自定义
   * 默认 default
   */
  layout?: 'default' | FatTableLayout;

  /**
   * 自定义布局参数
   */
  layoutProps?: any;

  /**
   * 唯一 id, 用于获取唯一 id
   */
  rowKey?: string | symbol | ((row: Item) => string | number);

  /**
   * 数据请求
   */
  request: (params: FatTableRequestParams<Item, Query>) => Promise<FatTableRequestResponse<Item>>;

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
  columns: FatTableColumn<Item, Query, any>[];

  /**
   * 列最小宽度设置, 可以用于实现列宽度自适应
   * @returns
   */
  columnMinWidth?: (column: FatTableColumn<Item, Query, any>) => string | number | undefined;

  /**
   * 列宽度设置, 可以用于实现列宽度自适应
   * @returns
   */
  columnWidth?: (column: FatTableColumn<Item, Query, any>) => string | number | undefined;

  /**
   * 是否显示 request 错误信息, 默认开启
   */
  enableErrorCapture?: boolean;

  /**
   * 空数据提示图片
   */
  emptyImage?: string;

  /**
   * 无数据提示文案, 默认为 暂无数据
   */
  emptyText?: string;

  /**
   * 异常标题, 默认为 '数据加载失败'
   */
  errorTitle?: string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 批量操作按钮
   */
  batchActions?:
    | FatTableBatchAction<Item, Query>[]
    | ((table: FatTableMethods<Item, Query>) => FatTableBatchAction<Item, Query>[]);

  /**
   * 是否开启 HMR, 默认 true
   */
  __hmr__?: boolean;
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
   * 自定义布局参数
   */
  layoutProps: any;

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

/**
 * fat-table 全局可配置参数
 */
export interface FatTableGlobalConfigurations {
  /**
   * 自定义表格布局
   */
  layout?: FatTableLayout;

  /**
   * 操作栏的对齐方式, 默认 center
   */
  actionsAlign?: LabelAlign;

  /**
   * 空数据提示图片
   */
  emptyImage?: string;

  /**
   * 表格默认空文案, 默认为暂无数据
   */
  emptyText?: string;

  /**
   * 表格异常标题
   */
  errorTitle?: string;

  /**
   * 是否开启缓存，默认开启
   */
  enableCacheQuery?: boolean;
}
