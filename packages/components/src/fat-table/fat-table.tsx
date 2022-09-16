import {
  Table,
  Pagination,
  SortOrder,
  TableMethods,
  Alert,
  Empty,
  vLoading,
  Message,
  MessageBox,
} from '@wakeadmin/element-adapter';
import { ref, onMounted, reactive, nextTick, watch, readonly, set as $set, computed } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, withDirectives } from '@wakeadmin/h';
import { debounce, set as _set, cloneDeep, equal, NoopArray } from '@wakeadmin/utils';

import { useRoute, useRouter } from '../hooks';
import {
  hasSlots,
  inheritProps,
  reactiveAssign,
  renderSlot,
  ToHEmitDefinition,
  toUndefined,
  createMessageBoxOptions,
  createMessageOptions,
} from '../utils';
import { FatFormMethods } from '../fat-form';
import { useFatConfigurable } from '../fat-configurable';

import {
  FatTableProps,
  PaginationState,
  QueryStateCache,
  FatTableRequestParams,
  FatTableColumn,
  FatTableSort,
  FatTableFilter,
  FatTableMethods,
  FatTableEvents,
  FatTableLayout,
} from './types';
import { validateColumns, genKey, mergeAndTransformQuery } from './utils';
import { Query } from './query';
import { Column } from './column';
import { BUILTIN_LAYOUTS } from './layouts';

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<FatTableProps<any, any>>({
    rowKey: null,
    request: null,
    requestOnMounted: { type: Boolean, default: true },
    requestOnSortChange: { type: Boolean, default: true },
    requestOnFilterChange: { type: Boolean, default: true },
    requestOnQueryChange: { type: Boolean, default: true },
    requestOnRemoved: { type: Boolean, default: true },
    remove: null,
    confirmBeforeRemove: { type: [Boolean, Function, Object, String] as any, default: true },
    messageOnRemoved: { type: [Boolean, Function, Object, String] as any, default: true },
    messageOnRemoveFailed: { type: [Boolean, Function, Object, String] as any, default: true },
    columns: null,
    enableCacheQuery: { type: Boolean, default: true },
    namespace: null,
    enablePagination: { type: Boolean, default: true },
    paginationProps: null,
    enableSelect: { type: Boolean, default: false },
    selectable: null,
    enableQuery: { type: Boolean, default: true },
    query: null,
    initialQuery: null,
    queryWatchDelay: null,
    formProps: null,
    enableErrorCapture: { type: Boolean, default: true },
    emptyText: null,
    errorTitle: null,
    title: null,
    layout: null,
    layoutProps: null,

    // slots
    renderTitle: null,
    renderNavBar: null,
    renderBeforeForm: null,
    renderFormHeading: null,
    renderBeforeSubmit: null,
    renderFormTrailing: null,
    renderAfterForm: null,
    renderToolbar: null,
    renderError: null,
    renderTableHeading: null,
    renderEmpty: null,
    renderTableTrailing: null,
    renderBottomToolbar: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatTableEvents<any>>>(),
  setup(props, { slots, expose, attrs, emit }) {
    validateColumns(props.columns);

    let uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;

    // 搜索状态缓存 key
    const queryCacheKey = props.namespace ? `_t_${props.namespace}` : '_t';
    const queryWatchDelay = props.queryWatchDelay ?? 800;

    const enableCacheQuery = props.enableCacheQuery;

    const tableRef = ref<TableMethods>();
    const formRef = ref<FatFormMethods<any>>();
    const router = useRouter();
    const route = useRoute();
    const configurable = useFatConfigurable();

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
      pageSize: props.paginationProps?.pageSize ?? configurable.pagination?.pageSize ?? 10,
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
        const cache = JSON.parse(data) as QueryStateCache;

        emit('queryCacheRestore', cache);

        reactiveAssign(pagination, cache.pagination);

        if (cache.query) {
          reactiveAssign(query.value, cache.query);
        }

        if (cache.sort !== undefined) {
          sort.value = cache.sort;
        }

        if (cache.filter) {
          reactiveAssign(filter, cache.filter);
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
      const payload: QueryStateCache = {
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
      // 不清空，会导致 table 弹跳，闪现空状态
      // list.value = [];
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

        emit('load', list.value);

        // 缓存请求状态
        saveCache();
      } catch (err) {
        error.value = err as Error;
        console.error(`[fat-table] 数据加载失败`, err);

        emit('error', error.value);
      } finally {
        loading.value = false;
        ready.value = true;
      }
    };

    /**
     * 执行搜索
     */
    const search = async (validate = true) => {
      // 检查校验状态
      try {
        if (props.enableQuery && formRef.value && validate) {
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
      (validate = true) => {
        // 取消正在 debounce 的请求
        debouncedSearch.cancel();
        search(validate);
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
        reactiveAssign(filter, cloneDeep(initialFilter));
      }

      sort.value = initialSort ? cloneDeep(initialSort) : undefined;
      if (updateTable && tableRef.value) {
        if (sort.value) {
          tableRef.value.sort(sort.value.prop, sort.value.order);
        } else {
          tableRef.value.clearSort();
        }
      }
    };

    setInitialValue();

    // 监听 query 变动
    if (props.requestOnQueryChange) {
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
      // 缓存恢复
      if (enableCacheQuery && route?.query[queryCacheKey] != null) {
        // 开启了缓存
        // 恢复搜索缓存
        uid = route.query[queryCacheKey] as string;
        restoreFromCache();
      }

      if (enableCacheQuery) {
        // 开启了缓存
        if (route?.query[queryCacheKey] != null) {
          if (props.requestOnMounted) {
            await nextTick();
            fetch();
          }
        } else {
          // 初始化缓存
          await initialCacheIfNeed();
          if (props.requestOnMounted) {
            await nextTick();
            fetch();
          }
        }
      } else if (props.requestOnMounted) {
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

      if (props.requestOnSortChange) {
        leadingDebouncedSearch();
      }
    };

    const handleFilterChange = (evt: { [columnKey: string]: any[] }) => {
      const keys = Object.keys(evt);
      let dirty = false;

      for (const key of keys) {
        const column = props.columns.find((i, idx) => {
          return key === i.prop;
        });

        if (column) {
          $set(filter, column.prop!, evt[key]);
          dirty = true;
        }
      }

      if (dirty && props.requestOnFilterChange) {
        fetch();
      }
    };

    const handleSearch = () => {
      leadingDebouncedSearch(false);
    };

    const handleReset = () => {
      // 重置表单状态、排序状态、筛选状态
      setInitialValue(true);

      emit('reset');

      debouncedSearch();
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
        const confirmOptions = createMessageBoxOptions(
          props.confirmBeforeRemove,
          {
            title: '提示',
            message: '是否确认删除?',
            type: 'warning',
            showCancelButton: true,
          },
          { items, ids }
        );

        if (confirmOptions) {
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
        const removeMessageOptions = createMessageOptions(
          props.messageOnRemoved,
          {
            message: '删除成功',
            type: 'success',
          },
          { items, ids }
        );

        if (removeMessageOptions) {
          Message(removeMessageOptions);
        }

        // 移除
        if (props.requestOnRemoved) {
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

        const removeFailedMessageOptions = createMessageOptions(
          props.messageOnRemoveFailed,
          {
            message: `删除失败: ${(err as Error).message}`,
            type: 'error',
          },
          { items, ids, error: err as Error }
        );

        if (removeFailedMessageOptions) {
          Message(removeFailedMessageOptions);
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
      if (formRef.value) {
        formRef.value.reset();
      } else {
        handleReset();
      }
    };

    // 选择指定行
    const select = (...items: any[]) => {
      items.forEach(i => {
        tableRef.value?.toggleRowSelection(i, true);
      });
    };

    const unselect = (...items: any[]) => {
      items.forEach(i => {
        tableRef.value?.toggleRowSelection(i, false);
      });
    };

    // 选择相关方法
    const selectAll = () => {
      selected.value = list.value.slice(0);
      select(...selected.value);
    };

    const unselectAll = () => {
      selected.value = [];
      tableRef.value?.clearSelection();
    };

    const doLayout = () => tableRef.value?.doLayout();
    const gotoPage = (page: number) => handlePageCurrentChange(page);

    const tableInstance: FatTableMethods<any, any> = {
      get tableRef() {
        return tableRef.value;
      },
      get formRef() {
        return formRef.value;
      },
      get selected() {
        return selected.value;
      },
      get list() {
        return list.value;
      },
      set list(newList: any[]) {
        list.value = newList;
      },
      get loading() {
        return loading.value;
      },
      get error() {
        return toUndefined(error.value);
      },
      get query() {
        return query.value;
      },
      get filter() {
        return filter;
      },
      get sort() {
        return toUndefined(sort.value);
      },
      get pagination() {
        return readonly(pagination);
      },
      remove,
      removeSelected,
      select,
      unselect,
      selectAll,
      unselectAll,
      doLayout,
      gotoPage,
      search: leadingDebouncedSearch,
      refresh: fetch,
      reset,
    };

    expose(tableInstance);

    const renderTitle = computed(() =>
      hasSlots(props, slots, 'title') || props.title
        ? () => (hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', tableInstance) : props.title)
        : undefined
    );

    return () => {
      const layout = props.layout ?? configurable.fatTable?.layout ?? 'default';
      const layoutImpl: FatTableLayout = typeof layout === 'function' ? layout : BUILTIN_LAYOUTS[layout];

      if (layoutImpl == null) {
        throw new Error(`[fat-table]: unknown layout: ${layout}`);
      }

      const columns = (props.columns ?? NoopArray).filter(i => i.type !== 'query');

      // 注入选择行
      if (props.enableSelect && !isSelectionColumnDefined) {
        columns.unshift({ type: 'selection', width: '80', selectable: props.selectable });
      }

      return layoutImpl({
        rootProps: {
          class: attrs.class,
          style: attrs.style,
        },
        layoutProps: props.layoutProps,
        renderTitle: renderTitle.value,
        renderNavBar: () => renderSlot(props, slots, 'navBar', tableInstance),
        renderQuery: props.enableQuery
          ? () => [
              renderSlot(props, slots, 'beforeForm', tableInstance),
              <Query
                loading={loading.value}
                initialValue={props.initialQuery}
                formRef={() => formRef}
                query={() => query}
                formProps={props.formProps}
                columns={props.columns}
                onSubmit={handleSearch}
                onReset={handleReset}
                v-slots={{
                  before() {
                    return renderSlot(props, slots, 'formHeading', tableInstance);
                  },
                  beforeButtons() {
                    return renderSlot(props, slots, 'beforeSubmit', tableInstance);
                  },
                  afterButtons() {
                    return renderSlot(props, slots, 'formTrailing', tableInstance);
                  },
                }}
              ></Query>,
              renderSlot(props, slots, 'afterForm', tableInstance),
            ]
          : undefined,
        renderError:
          error.value && props.enableErrorCapture
            ? () =>
                hasSlots(props, slots, 'error') ? (
                  renderSlot(props, slots, 'error')
                ) : (
                  <Alert
                    title={props.errorTitle ?? configurable.fatTable?.errorTitle ?? '数据加载失败'}
                    type="error"
                    showIcon
                    description={error.value!.message}
                    closable={false}
                  />
                )
            : undefined,
        renderToolbar: hasSlots(props, slots, 'toolbar')
          ? () => renderSlot(props, slots, 'toolbar', tableInstance)
          : undefined,
        renderTable: () => (
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
              empty: hasSlots(props, slots, 'empty') ? (
                renderSlot(props, slots, 'empty', tableInstance)
              ) : (
                <Empty description={props.emptyText ?? configurable.fatTable?.emptyText ?? '暂无数据'}></Empty>
              ),
            }}
          >
            {renderSlot(props, slots, 'tableHeading', tableInstance)}

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

            {renderSlot(props, slots, 'tableTrailing', tableInstance)}
          </Table>
        ),
        renderBottomToolbar: hasSlots(props, slots, 'bottomToolbar')
          ? () => renderSlot(props, slots, 'bottomToolbar', tableInstance)
          : undefined,
        renderPagination: props.enablePagination
          ? () => (
              <Pagination
                {...configurable.pagination}
                {...props.paginationProps}
                class={props.paginationProps?.className}
                currentPage={pagination.current}
                total={pagination.total}
                pageSize={pagination.pageSize}
                disabled={loading.value || props.paginationProps?.disabled}
                onSizeChange={handlePageSizeChange}
                onCurrentChange={handlePageCurrentChange}
              ></Pagination>
            )
          : undefined,
      });
    };
  },
});

export const FatTable = FatTableInner as any as <T extends {}, S extends {}>(props: FatTableProps<T, S>) => any;
