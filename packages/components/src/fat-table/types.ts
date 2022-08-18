import {
  FilterList,
  SortOrder,
  FormProps,
  FormItemProps,
  MessageBoxOptions,
  MessageOptions,
} from '@wakeadmin/component-adapter';

import { AtomicCommonProps } from '../atomic';
import { PaginationProps } from '../definitions';
import { ClassValue } from '../types';

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
 * 表格方法
 */
export interface FatTableMethods<T> {
  /**
   * 获取已选中的记录
   */
  getSelected(): T[];
  select(items: T[]): void;
  unselect(items: T[]): void;
  selectAll(): void;
  unselectAll(): void;
  remove(...items: T[]): Promise<void>;
  removeSelected(): Promise<void>;
}

/**
 * 列声明
 */
export interface FatTableColumn<
  T extends {},
  K extends keyof T = keyof T,
  ValueType extends keyof AtomicProps = keyof AtomicProps,
  ValueProps = AtomicProps[ValueType]
> {
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
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right';

  /**
   * 字段名
   * 当列类型为 表单字段、排序字段、筛选字段 时， prop 是必填的
   */
  prop?: K;

  /**
   * 手动从行数据中提取数据, 用于取代 prop 以实现复杂数据的提取和格式化
   */
  getter?: (row: T, index: number) => any;

  /**
   * 自定义单元格渲染
   */
  render?: (value: T[K], row: T, index: number) => any;

  /**
   * 字段类型, 默认为 text
   */
  valueType?: ValueType | ((props: AtomicCommonProps<any>) => any);

  /**
   * 字段选项
   */
  valueProps?: ValueProps & Partial<AtomicCommonProps<any>>;

  /**
   * 是否支持排序, 默认 false
   *
   * 可以配置默认排序， 但是仅支持一个字段配置默认排序
   *
   * 注意：目前仅支持后端接口排序
   */
  sortable?: boolean | SortOrder;

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

  // -------------- 标题 --------------
  /**
   * 文本标题
   */
  label?: string;

  /**
   * 标题类名
   */
  labelClass?: ClassValue;

  /**
   * 自定义标题渲染
   */
  renderLabel?: (index: number, column: FatTableColumn<T, K, ValueType, ValueProps>) => any;

  /**
   * 标题对齐
   */
  labelAlign?: 'left' | 'center' | 'right';

  // --------------- 样式  -------------------
  /**
   * 字段类名
   */
  class?: ClassValue;

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

  // --------------- index 类型特定参数  -------------------
  /**
   * 如果设置了 type=index，可以通过传递 index 属性来自定义索引
   */
  index?: number | ((index: number) => number);

  // --------------- actions 类型特定参数 -----------------
  /**
   * 操作
   */
  actions?: (Omit<FatTableAction, 'onClick'> & {
    // 重载点击方法
    onClick: (
      table: FatTableMethods<T>,
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
  actionsClass?: ClassValue;

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
  formItemProps?: FormItemProps;

  /**
   * 表单的默认值
   */
  initialValue?: any;

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
}

/**
 * fat-table 参数
 */
export interface FatTableProps<T extends {}, S extends {}> {
  /**
   * 唯一 id
   */
  rowKey?: string;

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

  /**
   * 列声明
   */
  columns: FatTableColumn<T>[];

  /**
   * 是否缓存搜索状态, 默认开启
   * 注意，一个页面中，应该只有一个 fat-table 开启缓存，否则会冲突。
   * 这种情况，为了避免冲突，需要手动指定 namespace
   */
  enableCacheQuery?: boolean;

  /**
   * 缓存命名空间，用于避免在同一个页面中缓存键冲突
   */
  namespace?: string;

  /**
   * 是否开启分页展示, 默认开启
   */
  enablePagination?: boolean;

  /**
   * 分页配置
   */
  paginationProps?: PaginationProps;

  /**
   * 是否开启选择模式， 默认关闭
   * TODO: 后续支持 ref 参数
   */
  enableSelect?: boolean;

  /**
   * 判断行是否可以选择
   */
  selectable?: (row: T, index: number) => boolean;

  /**
   * 是否开启表单搜索, 默认开启
   */
  enableQuery?: boolean;

  /**
   * 用于 request 查询的额外参数，一旦变化会触发重新加载
   * 也可以用它来实现自定义查询表单。
   * query 将会合并到 request 参数的 query 字段中
   */
  query?: any;

  /**
   * 是否监听 query 的变动，并触发重新加载，默认为 true
   */
  enableQueryWatch?: boolean;

  /**
   * query 防抖时长，默认为 800ms
   */
  queryWatchDelay?: number;

  /**
   * 搜索表单属性
   */
  formProps?: FormProps;

  /**
   * 是否显示 request 错误信息, 默认开启
   */
  enableErrorCapture?: boolean;

  /**
   * 开启搜索按钮, 默认开启
   */
  enableSearchButton?: boolean;

  /**
   * 开启重置按钮, 默认开启
   */
  enableResetButton?: boolean;

  /**
   * 搜索按钮文本
   */
  searchText?: string;

  /**
   * 重置按钮文本
   */
  resetText?: string;

  /**
   * 空状态文本。默认为暂无数据
   */
  emptyText?: string;

  // TODO: 其他表格属性
}

export interface PaginationState {
  total: number;
  current: number;
  pageSize: number;
}

/**
 * 查询状态缓存
 */
export interface SearchStateCache {
  query: any;
  pagination: PaginationState;
  sort?: FatTableSort | null;
  filter?: FatTableFilter;
}
