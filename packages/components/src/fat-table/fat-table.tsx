import { Table, TableColumn, Pagination } from '@wakeadmin/component-adapter';
import { VNode, ref, onMounted, reactive, nextTick } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { NoopObject, debounce } from '@wakeadmin/utils';

import { AtomicCommonProps } from '../atomic';
import { useAtomicRegistry, useRoute, useRouter } from '../hooks';
import { PaginationProps, DEFAULT_PAGINATION_PROPS } from '../definitions';

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
   * 搜索字段
   */
  query: S;

  /**
   * 当前列表
   */
  list: T[];
}

export interface FatTableRequestResponse<T> {
  list: T[];
  total: number;
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
  render?: (value: T[K], row: T, index: number) => VNode;

  /**
   * 字段类型, 默认为 text
   */
  valueType?: ValueType;

  /**
   * 字段选项
   */
  valueProps?: ValueProps & Partial<AtomicCommonProps<any>>;

  // -------------- 标题 --------------
  /**
   * 文本标题
   */
  label?: string;

  /**
   * 标题类名
   */
  labelClass?: string;

  /**
   * 自定义标题渲染
   */
  renderLabel?: (index: number, column: FatTableColumn<T, K, ValueType, ValueProps>) => VNode;

  /**
   * 标题对齐
   */
  labelAlign?: 'left' | 'center' | 'right';

  // --------------- 样式  -------------------
  /**
   * 字段类名
   */
  class?: string;

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
}

/**
 * props
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
  cacheQuery?: boolean;

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
}

interface PaginationState {
  total: number;
  current: number;
  pageSize: number;
}

interface SearchStateCache {
  query: any;
  pagination: PaginationState;
}

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<FatTableProps<any, any>>(['showError', 'request', 'remove', 'columns', 'rowKey']),
  // TODO: 暴露更多事件
  emits: declareEmits<{
    cacheStateChange: () => void;
  }>(),
  slots: declareSlots<{ beforeColumns: never; afterColumns: never }>(),
  setup(props, { slots, emit }) {
    let uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;
    // 搜索状态缓存 key
    const queryCacheKey = props.namespace ? `_t_${props.namespace}` : '_t';
    const cacheQuery = props.cacheQuery ?? true;
    const requestOnMounted = props.requestOnMounted ?? true;
    const router = useRouter();
    const route = useRoute();

    // 列表数据
    const list = ref<any[]>([]);

    // 已选中列
    const selected = ref<any[]>([]);

    // 加载中
    const loading = ref(false);

    // const ready = ref(false);
    const error = ref<Error | null>(null);

    // 表格是否就绪
    // ready 表示的是已经进行过请求。
    // 这里使用了 ready 避免在 query 从缓存中恢复后又重新请求一次
    const ready = ref(false);

    // 原件
    const atomics = useAtomicRegistry();

    // 分页状态
    const pagination = reactive<PaginationState>({
      total: 0,
      current: 1,
      pageSize: props.paginationProps?.pageSize ?? DEFAULT_PAGINATION_PROPS.pageSize ?? 10,
    });

    /**
     * 表单查询状态
     */
    const query = ref<any>({});

    /**
     * 初始化缓存
     */
    const initialCacheIfNeed = () => {
      if (route?.query[queryCacheKey] == null) {
        return router?.replace({
          ...route,
          query: {
            ...route?.query,
            [queryCacheKey]: uid,
          },
        });
      }
    };

    const restoreFromCache = () => {
      const key = `__fat-table(${uid})__`;
      const data = window.sessionStorage.getItem(key);

      if (data) {
        const cache = JSON.parse(data) as SearchStateCache;
        Object.assign(pagination, cache.pagination);

        query.value = cache.query;
      }
    };

    /**
     * 缓存请求状态
     */
    const saveCache = debounce(() => {
      if (!cacheQuery) {
        return;
      }

      const key = `__fat-table(${uid})__`;
      const payload: SearchStateCache = {
        pagination,
        query: query.value,
      };
      window.sessionStorage.setItem(key, JSON.stringify(payload));
      initialCacheIfNeed();
    }, 800);

    /**
     * 重置表格状态
     */
    const reset = () => {
      loading.value = false;
      error.value = null;
      list.value = [];
      selected.value = [];
      pagination.total = 0;
      pagination.current = 1;
    };

    /**
     * 数据请求
     */
    const fetch = async () => {
      const params: FatTableRequestParams<any, any> = {
        pagination: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          offset: (pagination.current - 1) * pagination.pageSize,
        },
        query: query.value,
        list: list.value,
      };

      try {
        loading.value = true;
        error.value = null;
        const response = await props.request(params);
        pagination.total = response.total;
        list.value = response.list;
        ready.value = true;
      } catch (err) {
        error.value = err as Error;
      } finally {
        loading.value = false;

        // 缓存请求状态
        saveCache();
      }
    };

    /**
     * 执行搜索
     */
    const search = () => {
      reset();
      fetch();
    };

    // const debouncedSearch = debounce(search, 800, { leading: true });

    /**
     * 启动
     */
    onMounted(async () => {
      if (cacheQuery) {
        // 开启了缓存
        if (route?.query[queryCacheKey] != null) {
          // 恢复搜索缓存
          uid = route.query[queryCacheKey] as string;
          restoreFromCache();

          if (requestOnMounted) {
            await nextTick();
            fetch();
          }
        } else {
          // 初始化缓存
          await initialCacheIfNeed();
          if (requestOnMounted) {
            await nextTick();
            fetch();
          }
        }
      } else if (requestOnMounted) {
        fetch();
      }
    });

    const handlePageSizeChange = (value: number) => {
      pagination.pageSize = value;
      search();
    };

    const handlePageCurrentChange = (value: number) => {
      pagination.current = value;
      fetch();
    };

    return () => {
      return (
        <div class="fat-table">
          <Table data={list.value} rowKey={props.rowKey}>
            {slots.beforeColumns?.()}
            {props.columns?.map((column, index) => {
              const type = column.type ?? 'default';
              const key = `${String(column.prop ?? '')}_${index}`;
              const valueType = column.valueType ?? 'text';
              const valueProps = column.valueProps ?? NoopObject;

              let children: any;

              if (type === 'default' || type === 'expand') {
                children = {
                  default: (scope: { row: any; $index: number }) => {
                    // 自定义渲染
                    const prop = column.prop;
                    const row = scope.row;
                    const idx = scope.$index;
                    const value = prop ? row[prop] : undefined;

                    if (column.render) {
                      return column.render(value, row, idx);
                    } else {
                      // 按照 valueType 渲染
                      const atom = atomics.registered(valueType);
                      if (atom == null) {
                        throw new Error(`[fat-table] 未能识别类型为 ${valueType} 的原件`);
                      }

                      const comp = atom.component;

                      return comp({
                        mode: 'preview',
                        value,
                        ...valueProps,
                      });
                    }
                  },
                };
              } else if (type === 'actions') {
                // 操作
              }

              return (
                <TableColumn
                  type={type}
                  key={key}
                  prop={column.prop as string}
                  label={column.label}
                  renderHeader={column.renderLabel?.bind(null, index, column)}
                  // 样式
                  className={column.class}
                  labelClassName={column.labelClass}
                  width={column.width}
                  minWidth={column.minWidth}
                  align={column.align}
                  headerAlign={column.labelAlign}
                  fixed={column.fixed}
                  // index 特定属性
                  index={type === 'index' ? column.index : undefined}
                >
                  {children}
                </TableColumn>
              );
            })}
            {slots.afterColumns?.()}
          </Table>
          {props.enablePagination !== false && (
            <Pagination
              {...DEFAULT_PAGINATION_PROPS}
              {...props.paginationProps}
              class={['fat-table__pagination', props.paginationProps?.class]}
              currentPage={pagination.current}
              total={pagination.total}
              pageSize={pagination.pageSize}
              disabled={loading.value || props.paginationProps?.disabled}
              onSizeChange={handlePageSizeChange}
              onCurrentChange={handlePageCurrentChange}
            ></Pagination>
          )}
        </div>
      );
    };
  },
});

export const FatTable = FatTableInner as any as <T extends {}, S extends {}>(props: FatTableProps<T, S>) => VNode;
