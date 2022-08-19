import {
  Table,
  Pagination,
  SortOrder,
  FormMethods,
  TableMethods,
  Alert,
  Empty,
  vLoading,
  MessageBoxOptions,
  Message,
  MessageBox,
  MessageOptions,
} from '@wakeadmin/component-adapter';
import { VNode, ref, onMounted, reactive, nextTick, watch } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots, withDirectives } from '@wakeadmin/h';
import { debounce, set as _set, cloneDeep, equal, NoopArray, merge, isPlainObject } from '@wakeadmin/utils';

import { useRoute, useRouter } from '../hooks';
import { DEFAULT_PAGINATION_PROPS } from '../definitions';
import { inheritProps, normalizeClassName, toUndefined } from '../utils';

import {
  FatTableProps,
  PaginationState,
  SearchStateCache,
  FatTableRequestParams,
  FatTableColumn,
  FatTableSort,
  FatTableFilter,
} from './types';
import { validateColumns, genKey, mergeAndTransformQuery, isQueryable } from './utils';
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
    'requestOnQueryChange',
    'requestOnRemoved',
    'remove',
    'confirmBeforeRemove',
    'messageOnRemoved',
    'messageOnRemoveFailed',
    'columns',
    'enableCacheQuery',
    'namespace',
    'enablePagination',
    'paginationProps',
    'enableSelect',
    'selectable',
    'enableQuery',
    'query',
    'initialQuery',
    'queryWatchDelay',
    'formProps',
    'enableErrorCapture',
    'enableSearchButton',
    'enableResetButton',
    'searchText',
    'resetText',
    'emptyText',
  ]),
  // TODO: 暴露更多事件
  emits: declareEmits<{
    cacheStateChange: () => void;
  }>(),
  slots: declareSlots<{ beforeColumns: never; afterColumns: never }>(),
  setup(props, { slots, expose, attrs }) {
    validateColumns(props.columns);

    let uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;

    // 搜索状态缓存 key
    const queryCacheKey = props.namespace ? `_t_${props.namespace}` : '_t';
    const queryWatchDelay = props.queryWatchDelay ?? 800;

    const enableCacheQuery = props.enableCacheQuery ?? true;
    const enableQuery = props.enableQuery ?? true;
    const enableSearchButton = props.enableSearchButton ?? true;
    const enableResetButton = props.enableResetButton ?? true;
    const enableErrorCapture = props.enableErrorCapture ?? true;

    const requestOnMounted = props.requestOnMounted ?? true;
    const requestOnSortChange = props.requestOnSortChange ?? true;
    const requestOnFilterChange = props.requestOnFilterChange ?? true;
    const requestOnQueryChange = props.requestOnQueryChange ?? true;
    const requestOnRemoved = props.requestOnRemoved ?? true;

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
          Object.assign(query.value, cache.query);
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
      const q = mergeAndTransformQuery(query.value, props.query, props.columns);
      const params: FatTableRequestParams<any, any> = {
        pagination: {
          page: pagination.current,
          pageSize: pagination.pageSize,
          offset: (pagination.current - 1) * pagination.pageSize,
        },
        query: q,
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

    const getId = (a: any) => {
      if (props.rowKey == null) {
        throw new Error(`[fat-table] 请配置 rowKey `);
      }

      if (typeof props.rowKey === 'function') {
        return props.rowKey(a);
      }

      return a[props.rowKey];
    };

    const compare = (a: any, b: any) => {
      return getId(a) === getId(b);
    };

    // 字段状态初始化
    const initialQuery: any = {};
    let initialSort: FatTableSort | undefined;
    const initialFilter: FatTableFilter = {};

    // 用户定义的表单初始值
    if (props.initialQuery != null) {
      const userInitialQuery = typeof props.initialQuery === 'function' ? props.initialQuery() : props.initialQuery;

      if (isPlainObject(userInitialQuery)) {
        merge(initialQuery, cloneDeep(userInitialQuery));
      }
    }

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
      if (isQueryable(column) && column.initialValue !== undefined) {
        const prop = (typeof column.queryable === 'string' ? column.queryable : column.prop) as string;
        const value = typeof column.initialValue === 'function' ? column.initialValue() : column.initialValue;

        if (prop) {
          _set(initialQuery, prop, value);
        } else if (isPlainObject(value)) {
          merge(initialQuery, cloneDeep(value));
        }
      }
    }

    /**
     * 设置表单状态为初始值
     *
     * @param updateTable 是否更新表格状态。因为垃圾element-ui 的排序、筛选状态不支持双向绑定，某些场景需要手动更新
     */
    const setInitialValue = (updateTable = false) => {
      // element-ui 不支持后续通过方法重置 filter 状态，
      // 因此这里只有在初始化时才会执行
      if (!updateTable) {
        Object.assign(filter, cloneDeep(initialFilter));
      }

      if (updateTable && tableRef.value) {
        if (sort.value) {
          tableRef.value.sort(sort.value.prop, sort.value.order);
        } else {
          tableRef.value.clearSort();
        }
      }

      query.value = cloneDeep(initialQuery);
      sort.value = initialSort ? { ...initialSort } : undefined;
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
    if (requestOnQueryChange) {
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

    /**
     * 删除指定行
     */
    const remove = async (...items: any[]): Promise<void> => {
      if (items.length === 0) {
        return;
      }

      const ids = items.map(getId);

      try {
        if (props.confirmBeforeRemove !== false) {
          const confirmOptions: MessageBoxOptions = {
            title: '提示',
            message: '是否确认删除?',
            type: 'warning',
            showCancelButton: true,
            ...(typeof props.confirmBeforeRemove === 'function'
              ? props.confirmBeforeRemove(items, ids)
              : typeof props.confirmBeforeRemove === 'object'
              ? props.confirmBeforeRemove
              : undefined),
          };

          try {
            await MessageBox(confirmOptions);
          } catch (err) {
            // ignore
            return;
          }
        }

        // 开始删除
        if (props.remove == null) {
          throw new Error('[fat-table] 删除需要配置 remove 参数');
        }

        await props.remove(items, ids);

        // 删除成功提示
        if (props.messageOnRemoved !== false) {
          const messageOptions: MessageOptions = {
            message: '删除成功',
            type: 'success',
            ...(typeof props.messageOnRemoved === 'function'
              ? props.messageOnRemoved(items, ids)
              : typeof props.messageOnRemoved === 'object'
              ? props.messageOnRemoved
              : undefined),
          };
          Message(messageOptions);
        }

        // 移除
        if (requestOnRemoved) {
          fetch();
        } else {
          // 原地删除
          let deleted = 0;
          for (const item of items) {
            const idx = list.value.findIndex(i => compare(i, item));
            if (idx !== -1) {
              deleted++;
              list.value.splice(idx, 1);
            }
          }
          pagination.total -= deleted;
        }
      } catch (err) {
        console.error(`[fat-table] 删除失败`, err);

        if (props.messageOnRemoveFailed !== false) {
          const messageOptions: MessageOptions = {
            message: `删除失败: ${(err as Error).message}`,
            type: 'error',
            ...(typeof props.messageOnRemoveFailed === 'function'
              ? props.messageOnRemoveFailed(items, ids, err as Error)
              : typeof props.messageOnRemoveFailed === 'object'
              ? props.messageOnRemoveFailed
              : undefined),
          };
          Message(messageOptions);
        }
      }
    };

    /**
     * 删除选中行
     */
    const removeSelected = async (): Promise<void> => {
      if (!selected.value?.length) {
        return;
      }

      await remove(...selected.value);
      // 清理选中
      selected.value = [];
    };

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
      remove,
      removeSelected,
      getSelected,
      select,
      unselect,
      selectAll,
      unselectAll,
    };

    expose(tableInstance);

    return () => {
      const columns = (props.columns ?? NoopArray).filter(i => i.type !== 'query');

      // 注入选择行
      if (props.enableSelect && !isSelectionColumnDefined) {
        columns.unshift({ type: 'selection', width: '80', selectable: props.selectable });
      }

      return (
        <div class={normalizeClassName('fat-table', attrs.class)} style={attrs.style}>
          {!!enableQuery && (
            <Query
              loading={loading.value}
              formRef={() => formRef}
              query={query.value}
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
            {!!(error.value && enableErrorCapture) && (
              <Alert title="数据加载失败" type="error" showIcon description={error.value.message} closable={false} />
            )}
            <Table
              {...inheritProps()}
              {...withDirectives([[vLoading, loading.value]])}
              ref={tableRef}
              data={list.value}
              rowKey={props.rowKey}
              onSelectionChange={handleSelectionChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              defaultSort={toUndefined(sort.value)}
              v-slots={{
                empty() {
                  return <Empty description={props.emptyText ?? '暂无数据'}></Empty>;
                },
              }}
            >
              {slots.beforeColumns?.()}

              {columns?.map((column, index) => {
                return (
                  <Column
                    key={genKey(column, index)}
                    column={column}
                    index={index}
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
                class={['fat-table__pagination', props.paginationProps?.className]}
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
