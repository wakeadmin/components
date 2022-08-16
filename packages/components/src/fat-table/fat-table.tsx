import { Table, TableColumn, Pagination, TableColumnProps, SortOrder } from '@wakeadmin/component-adapter';
import { VNode, ref, onMounted, reactive, nextTick, set } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { NoopObject, debounce, NoopArray } from '@wakeadmin/utils';

import { useAtomicRegistry, useRoute, useRouter } from '../hooks';
import { DEFAULT_PAGINATION_PROPS } from '../definitions';
import { toUndefined } from '../utils';

import { FatTableProps, PaginationState, SearchStateCache, FatTableRequestParams, FatTableColumn } from './types';
import { FatTableAction, FatTableActions } from './table-actions';
import { validateColumns, genKey } from './utils';

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<FatTableProps<any, any>>([
    'rowKey',
    'showError',
    'request',
    'requestOnMounted',
    'remove',
    'columns',
    'enableCacheQuery',
    'namespace',
    'enablePagination',
    'paginationProps',
    'enableSelect',
    'selectable',
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
    const requestOnMounted = props.requestOnMounted ?? true;
    const requestOnSortChange = props.requestOnSortChange ?? true;
    const requestOnFilterChange = props.requestOnFilterChange ?? true;

    const tableRef = ref();
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

    // 用户是否手动定义了 selection
    let isSelectionColumnDefined: boolean;
    // 默认排序的字段
    const sort = ref<{ prop: string; order: 'ascending' | 'descending' } | undefined | null>();
    // 过滤条件
    const filter = reactive<{ [prop: string]: any[] }>({});

    // 字段状态初始化
    for (const column of props.columns) {
      if (column.type === 'selection') {
        isSelectionColumnDefined = true;
      }

      if (column.sortable && typeof column.sortable === 'string') {
        sort.value = {
          prop: column.prop as string,
          order: column.sortable,
        };
      }

      if (column.filterable) {
        set(filter, column.prop, column.filteredValue ?? []);
      }
    }

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

    // const compare = (a: any, b: any) => {
    //   if (props.rowKey == null) {
    //     throw new Error(`[fat-table] 请配置 rowKey `);
    //   }

    //   return a[props.rowKey] === b[props.rowKey];
    // };

    // 缓存回复
    if (enableCacheQuery && route?.query[queryCacheKey] != null) {
      // 开启了缓存
      // 恢复搜索缓存
      uid = route.query[queryCacheKey] as string;
      restoreFromCache();
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
      search();
    };

    const handlePageCurrentChange = (value: number) => {
      pagination.current = value;
      fetch();
    };

    const handleSelectionChange = (evt: any[]) => {
      selected.value = evt;
    };

    const handleSortChange = (evt: { column?: FatTableColumn<any>; prop?: string; order?: SortOrder }) => {
      sort.value = evt.prop == null ? null : { prop: evt.prop, order: evt.order! };

      if (requestOnSortChange) {
        fetch();
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
          <Table
            ref={tableRef}
            data={list.value}
            rowKey={props.rowKey}
            onSelectionChange={handleSelectionChange}
            onSortChange={handleSortChange}
            onFilterChange={handleFilterChange}
            defaultSort={toUndefined(sort.value)}
          >
            {!!props.enableSelect && !isSelectionColumnDefined && (
              <TableColumn type="selection" width="80" selectable={props.selectable} />
            )}

            {slots.beforeColumns?.()}

            {props.columns?.map((column, index) => {
              const type = column.type ?? 'default';
              const key = genKey(column, index);
              const valueType = column.valueType ?? 'text';
              const valueProps = column.valueProps ?? NoopObject;
              const extraProps: TableColumnProps = {};

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
              } else if (type === 'selection') {
                extraProps.selectable = props.selectable;
              } else if (type === 'actions') {
                // 操作
                children = {
                  default: (scope: { row: any; $index: number }) => {
                    return (
                      <FatTableActions
                        options={(column.actions ?? NoopArray).map(action => {
                          return {
                            ...action,
                            onClick: a => {
                              return action.onClick(tableInstance, scope.row, a, scope.$index);
                            },
                          } as FatTableAction;
                        })}
                        max={column.actionsMax}
                        class={column.actionsClass}
                        type={column.actionsType}
                        size={column.actionsSize}
                      />
                    );
                  },
                };
              } else if (type === 'index') {
                extraProps.index = column.index;
              }

              if (column.filterable && column.filterable.length) {
                extraProps.filters = column.filterable;
                extraProps.filteredValue = filter[column.prop as string] ?? [];
                extraProps.filterMultiple = column.filterMultiple;
              }

              return (
                <TableColumn
                  type={type}
                  key={key}
                  columnKey={key}
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
                  sortable={column.sortable ? 'custom' : undefined}
                  {...extraProps}
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
