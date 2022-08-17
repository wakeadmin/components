import {
  Table,
  TableColumn,
  Pagination,
  SortOrder,
  FormMethods,
  TableMethods,
  Alert,
  Empty,
  vLoading,
} from '@wakeadmin/component-adapter';
import { VNode, ref, onMounted, reactive, nextTick, watch } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots, withDirectives } from '@wakeadmin/h';
import { debounce, set as _set, clone, equal } from '@wakeadmin/utils';

import { useRoute, useRouter } from '../hooks';
import { DEFAULT_PAGINATION_PROPS } from '../definitions';
import { toUndefined } from '../utils';

import {
  FatTableProps,
  PaginationState,
  SearchStateCache,
  FatTableRequestParams,
  FatTableColumn,
  FatTableSort,
  FatTableFilter,
} from './types';
import { validateColumns, genKey } from './utils';
import { Query } from './query';
import { Column } from './column';

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<FatTableProps<any, any>>([
    'rowKey',
    'request',
    'requestOnMounted',
    'requestOnSortChange',
    'requestOnFilterChange',
    'remove',
    'columns',
    'enableCacheQuery',
    'namespace',
    'enablePagination',
    'paginationProps',
    'enableSelect',
    'selectable',
    'enableQuery',
    'query',
    'enableQueryWatch',
    'queryWatchDelay',
    'formProps',
    'enableSearchButton',
    'enableResetButton',
    'searchText',
    'resetText',
  ]),
  // TODO: 暴露更多事件
  emits: declareEmits<{
    cacheStateChange: () => void;
  }>(),
  slots: declareSlots<{ beforeColumns: never; afterColumns: never }>(),
  setup(props, { slots, expose }) {
    validateColumns(props.columns);

    let uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;
    // 搜索状态缓存 key
    const queryCacheKey = props.namespace ? `_t_${props.namespace}` : '_t';
    const enableCacheQuery = props.enableCacheQuery ?? true;
    const enableQuery = props.enableQuery ?? true;
    const enableQueryWatch = props.enableQueryWatch ?? true;
    const enableSearchButton = props.enableSearchButton ?? true;
    const enableResetButton = props.enableResetButton ?? true;
    const queryWatchDelay = props.queryWatchDelay ?? 800;
    const requestOnMounted = props.requestOnMounted ?? true;
    const requestOnSortChange = props.requestOnSortChange ?? true;
    const requestOnFilterChange = props.requestOnFilterChange ?? true;

    const tableRef = ref<TableMethods>();
    const formRef = ref<FormMethods>();
    const router = useRouter();
    const route = useRoute();

    // 列表数据
    const list = ref<any[]>([]);

    // 已选中列
    const selected = ref<any[]>([]);

    // 加载中
    const loading = ref(false);

    const error = ref<Error | null>(null);

    // 表格是否就绪
    // ready 表示的是已经进行过请求。
    // 这里使用了 ready 避免在 query 从缓存中恢复后又重新请求一次
    const ready = ref(false);

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

    // 用户是否手动定义了 selection
    let isSelectionColumnDefined: boolean;
    // 默认排序的字段
    const sort = ref<FatTableSort | undefined | null>();
    // 过滤条件
    const filter = reactive<FatTableFilter>({});

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

        if (cache.query) {
          query.value = cache.query;
        }

        if (cache.sort !== undefined) {
          sort.value = cache.sort;
        }

        if (cache.filter) {
          Object.assign(filter, cache.filter);
        }
      }
    };

    /**
     * 缓存请求状态
     */
    const saveCache = debounce(() => {
      if (!enableCacheQuery) {
        return;
      }

      const key = `__fat-table(${uid})__`;
      const payload: SearchStateCache = {
        pagination,
        filter,
        query: query.value,
        sort: sort.value,
      };
      window.sessionStorage.setItem(key, JSON.stringify(payload));
      initialCacheIfNeed();
    }, 800);

    /**
     * 重置临时表格状态, 包括分页、选中、加载、错误等信息
     */
    const resetTempState = () => {
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
        filter,
        sort: toUndefined(sort.value),
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
        console.error(`[fat-table] 数据加载失败`, err);
      } finally {
        loading.value = false;

        // 缓存请求状态
        saveCache();
      }
    };

    /**
     * 执行搜索
     */
    const search = async () => {
      // 检查校验状态
      try {
        if (enableQuery && formRef.value) {
          await formRef.value.validate();
        }

        resetTempState();
        fetch();
      } catch (err) {
        console.warn(err);
      }
    };

    const debouncedSearch = debounce(search, queryWatchDelay);
    const leadingDebouncedSearch = debounce(
      () => {
        // 取消正在 debounce 的请求
        debouncedSearch.cancel();
        search();
      },
      queryWatchDelay,
      { leading: true }
    );

    // const compare = (a: any, b: any) => {
    //   if (props.rowKey == null) {
    //     throw new Error(`[fat-table] 请配置 rowKey `);
    //   }

    //   return a[props.rowKey] === b[props.rowKey];
    // };

    // 字段状态初始化
    const initialQuery: any = {};
    let initialSort: FatTableSort | undefined;
    const initialFilter: FatTableFilter = {};

    for (const column of props.columns) {
      if (column.type === 'selection') {
        isSelectionColumnDefined = true;
      }

      // 排序字段初始化
      if (column.sortable && typeof column.sortable === 'string') {
        initialSort = {
          prop: column.prop as string,
          order: column.sortable,
        };
      }

      // 过滤字段初始化
      if (column.filterable) {
        _set(initialFilter, column.prop!, column.filteredValue ?? []);
      }

      // 查询字段初始化
      if (column.queryable || column.type === 'query') {
        const prop = (typeof column.queryable === 'string' ? column.queryable : column.prop) as string;
        _set(initialQuery, prop, column.initialValue);
      }
    }

    /**
     * 设置表单状态为初始值
     *
     * @param updateTable 是否更新表格状态。因为垃圾element-ui 的排序、筛选状态不支持双向绑定，某些场景需要手动更新
     */
    const setInitialValue = (updateTable = false) => {
      query.value = clone(initialQuery);
      sort.value = initialSort ? { ...initialSort } : undefined;

      // element-ui 不支持后续通过方法重置 filter 状态，
      // 因此这里只有在初始化时才会执行
      if (!updateTable) {
        Object.assign(filter, clone(initialFilter));
      }

      if (updateTable && tableRef.value) {
        if (sort.value) {
          tableRef.value.sort(sort.value.prop, sort.value.order);
        } else {
          tableRef.value.clearSort();
        }
      }
    };

    setInitialValue();

    // 缓存恢复
    if (enableCacheQuery && route?.query[queryCacheKey] != null) {
      // 开启了缓存
      // 恢复搜索缓存
      uid = route.query[queryCacheKey] as string;
      restoreFromCache();
    }

    // 监听 query 变动
    if (enableQueryWatch) {
      watch(
        () => [query.value, props.query],
        () => {
          if (!ready.value || loading.value) {
            return;
          }
          debouncedSearch();
        },
        {
          deep: true,
          flush: 'post',
        }
      );
    }

    /**
     * 启动
     */
    onMounted(async () => {
      if (enableCacheQuery) {
        // 开启了缓存
        if (route?.query[queryCacheKey] != null) {
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
      leadingDebouncedSearch();
    };

    const handlePageCurrentChange = (value: number) => {
      pagination.current = value;
      fetch();
    };

    const handleSelectionChange = (evt: any[]) => {
      selected.value = evt;
    };

    const handleSortChange = (evt: { column?: FatTableColumn<any>; prop?: string; order?: SortOrder }) => {
      const value = evt.prop == null ? null : { prop: evt.prop, order: evt.order! };

      if (equal(sort.value, value)) {
        return;
      }

      sort.value = value;

      if (requestOnSortChange) {
        leadingDebouncedSearch();
      }
    };

    const handleFilterChange = (evt: { [columnKey: string]: any[] }) => {
      const keys = Object.keys(evt);
      let dirty = false;

      for (const key of keys) {
        const column = props.columns.find((i, idx) => {
          return key === genKey(i, idx);
        });

        if (column) {
          filter[column.prop as string] = evt[key];
          dirty = true;
        }
      }

      if (dirty && requestOnFilterChange) {
        fetch();
      }
    };

    /**
     *---------------------------------------+
     *          以下是公开方法                |
     *---------------------------------------+
     */

    const reset = async () => {
      // 重置表单状态、排序状态、筛选状态
      setInitialValue(true);

      debouncedSearch();
    };

    const getSelected = () => {
      return selected.value;
    };

    // 选择指定行
    const select = (items: any[]) => {
      items.forEach(i => {
        tableRef.value?.toggleRowSelection(i, true);
      });
    };

    const unselect = (items: any[]) => {
      items.forEach(i => {
        tableRef.value?.toggleRowSelection(i, false);
      });
    };

    // 选择相关方法
    const selectAll = () => {
      selected.value = list.value.slice(0);
      select(selected.value);
    };

    const unselectAll = () => {
      selected.value = [];
      tableRef.value?.clearSelection();
    };

    const tableInstance = {
      getSelected,
      select,
      unselect,
      selectAll,
      unselectAll,
    };

    expose(tableInstance);

    return () => {
      return (
        <div class="fat-table">
          {!!enableQuery && (
            <Query
              loading={loading}
              formRef={formRef}
              query={query}
              formProps={props.formProps}
              columns={props.columns}
              enableSearchButton={enableSearchButton}
              enableResetButton={enableResetButton}
              searchText={props.searchText}
              resetText={props.resetText}
              onSubmit={leadingDebouncedSearch}
              onReset={reset}
            />
          )}

          <div class="fat-table__body">
            {!!error.value && (
              <Alert title="数据加载失败" type="error" showIcon description={error.value.message} closable={false} />
            )}
            <Table
              ref={tableRef}
              data={list.value}
              rowKey={props.rowKey}
              onSelectionChange={handleSelectionChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              defaultSort={toUndefined(sort.value)}
              {...withDirectives([[vLoading, loading.value]])}
              v-slots={{
                empty() {
                  return <Empty description="暂无数据"></Empty>;
                },
              }}
            >
              {!!props.enableSelect && !isSelectionColumnDefined && (
                <TableColumn type="selection" width="80" selectable={props.selectable} />
              )}

              {slots.beforeColumns?.()}

              {props.columns?.map((column, index) => {
                return (
                  <Column
                    key={genKey(column, index)}
                    column={column}
                    index={index}
                    selectable={props.selectable}
                    filter={filter}
                    tableInstance={tableInstance}
                  />
                );
              })}
              {slots.afterColumns?.()}
            </Table>
          </div>

          <div class="fat-table__footer">
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
        </div>
      );
    };
  },
});

export const FatTable = FatTableInner as any as <T extends {}, S extends {}>(props: FatTableProps<T, S>) => VNode;
