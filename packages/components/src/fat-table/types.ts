import { SortOrder } from '@wakeadmin/component-adapter';

import { AtomicCommonProps } from '../atomic';
import { PaginationProps } from '../definitions';
import { ClassValue } from '../types';

import { FatTableAction, FatTableActionsProps } from './table-actions';

export interface FatTableSort {
  prop: string;
  order: SortOrder;
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
   * 搜索字段
   */
  query?: S;

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
  select(items: T[]): void;
  unselect(items: T[]): void;
  selectAll(): void;
  unselectAll(): void;
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
   * default 默认
   */
  type?: 'index' | 'selection' | 'expand' | 'actions' | 'default';

  /**
   * 对齐方式
   */
  align?: 'left' | 'center' | 'right';

  /**
   * 字段名
   */
  prop?: K;

  /**
   * 自定义渲染
   */
  render?: (value: T[K], row: T, index: number) => any;

  /**
   * 字段类型, 默认为 text
   */
  valueType?: ValueType;

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
   * 是否显示 request 错误信息
   */
  showError?: boolean;

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
   * 数据删除
   */
  remove?: (ids: any[], list: T[]) => Promise<void>;

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

  // TODO: 其他表格属性
}

export interface PaginationState {
  total: number;
  current: number;
  pageSize: number;
}

export interface SearchStateCache {
  query: any;
  pagination: PaginationState;
  sort?: FatTableSort | null;
}
