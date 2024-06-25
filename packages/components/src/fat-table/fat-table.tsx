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
import {
  ref,
  onMounted,
  reactive,
  nextTick,
  watch,
  readonly,
  set as $set,
  computed,
  onBeforeUnmount,
} from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots, withDirectives } from '@wakeadmin/h';
import { debounce, set as _set, cloneDeep, equal, NoopArray, get } from '@wakeadmin/utils';

import { useRoute, useRouter, useDevtoolsExpose, useT } from '../hooks';
import {
  hasSlots,
  inheritProps,
  reactiveAssign,
  renderSlot,
  ToHEmitDefinition,
  toUndefined,
  createMessageBoxOptions,
  createMessageOptions,
  ToHSlotDefinition,
  OurComponentInstance,
  normalizeClassName,
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
  FatTableSlots,
  FatTableRequestResponse,
  FatTableCustomTableScope,
} from './types';
import { FatTableSettingPayload } from './types-inner';
import { validateColumns, genKey, mergeAndTransformQuery, isQueryable, getColumnKey } from './utils';
import { useHMR } from '../utils/hmr';
import { Query } from './query';
import { Column } from './column';
import { BUILTIN_LAYOUTS } from './layouts';
import { BatchActions } from './batch-actions';
import { provideAtomicHost } from '../atomic/host';
import { ColumnSetting } from './column-setting';

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<Omit<FatTableProps<any, any>, keyof FatTableEvents<any, any>>>({
    rowKey: null,
    request: null,
    requestOnMounted: { type: Boolean, default: true },
    requestOnSortChange: { type: Boolean, default: true },
    requestOnFilterChange: { type: Boolean, default: true },
    requestOnQueryChange: { type: Boolean, default: false },
    requestOnExtraQueryChange: { type: Boolean, default: false },
    requestOnRemoved: { type: Boolean, default: true },
    remove: null,
    confirmBeforeRemove: { type: [Boolean, Function, Object, String] as any, default: true },
    messageOnRemoved: { type: [Boolean, Function, Object, String] as any, default: true },
    messageOnRemoveFailed: { type: [Boolean, Function, Object, String] as any, default: true },
    columns: null,
    columnMinWidth: null,
    columnWidth: null,
    enableCacheQuery: { type: Boolean, default: undefined },
    namespace: null,
    enablePagination: { type: Boolean, default: true },
    paginationProps: null,
    enableSetting: { type: Boolean, default: false },
    settingProps: null,
    enableSelect: { type: Boolean, default: false },
    selectable: null,
    enableQuery: { type: Boolean, default: true },
    extraQuery: null,
    initialQuery: null,
    queryWatchDelay: null,
    formProps: null,
    enableErrorCapture: { type: Boolean, default: true },
    emptyText: null,
    errorTitle: null,
    title: null,
    layout: null,
    layoutProps: null,
    batchActions: null,

    // slots
    renderTitle: null,
    renderNavBar: null,
    renderBeforeForm: null,
    renderFormHeading: null,
    renderBeforeSubmit: null,
    renderSubmitter: null,
    renderAfterSubmit: null,
    renderFormTrailing: null,
    renderAfterForm: null,
    renderToolbar: null,
    renderError: null,
    renderTableHeading: null,
    renderEmpty: null,
    renderTableTrailing: null,
    renderBottomToolbar: null,
    renderAfterTable: null,
    renderBeforeTable: null,
    renderTable: null,

    // private
    __hmr__: { type: Boolean, default: true },
  }),
  emits: declareEmits<ToHEmitDefinition<FatTableEvents<any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatTableSlots<any, any>>>(),
  setup(props, { slots, expose, attrs, emit }) {
    validateColumns(props.columns);

    let uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;

    // 搜索状态缓存 key
    const queryCacheKey = props.namespace ? `_t_${props.namespace}` : '_t';
    const queryWatchDelay = props.queryWatchDelay ?? 800;
    const configuration = useFatConfigurable();

    const enableCacheQuery = props.enableCacheQuery ?? configuration.fatTable?.enableCacheQuery ?? true;

    const tableRef = ref<TableMethods>();
    const formRef = ref<FatFormMethods<any>>();
    const router = useRouter();
    const route = useRoute();
    const configurable = useFatConfigurable();
    const hmr = useHMR(props.__hmr__);

    const t = useT();

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

    const settings = ref<FatTableSettingPayload | undefined>();

    const restoreSetting = () => {
      if (!props.enableSetting) {
        return;
      }

      // 表格配置初始化
      if (!props.settingProps?.persistentKey) {
        throw new Error(`[fat-table] 开启 enableSetting 后请配置 settingProps.persistentKey `);
      }

      const storage = props.settingProps.persistentType === 'session' ? window.sessionStorage : window.localStorage;
      const data = storage.getItem(`_fat-table_v1.` + props.settingProps.persistentKey);

      if (data != null) {
        settings.value = JSON.parse(data);
      }
    };

    const saveSetting = () => {
      if (!props.enableSetting) {
        return;
      }

      // 表格配置初始化
      if (!props.settingProps?.persistentKey) {
        throw new Error(`[fat-table] 开启 enableSetting 后请配置 settingProps.persistentKey `);
      }

      const storage = props.settingProps.persistentType === 'session' ? window.sessionStorage : window.localStorage;
      const data = JSON.stringify(settings.value);
      storage.setItem(`_fat-table_v1.` + props.settingProps.persistentKey, data);
    };

    /**
     * 初始化缓存
     */
    const initialCacheIfNeed = () => {
      if (router && route?.query?.[queryCacheKey] == null) {
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

    const getRequestParams = () => {
      const q = mergeAndTransformQuery(query.value, props.extraQuery, props.columns);
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

      return params;
    };

    /**
     * 数据请求
     */
    const fetch = async (initial: boolean = false) => {
      try {
        loading.value = true;
        error.value = null;
        const params = getRequestParams();

        let response: FatTableRequestResponse<any> | undefined;

        if (process.env.NODE_ENV === 'development' && initial) {
          const cache = hmr?.loadState();

          if (cache) {
            response = cache as any;
          }
        }

        if (!response) {
          response = await props.request(params);

          if (process.env.NODE_ENV === 'development' && initial) {
            // 缓存
            hmr?.saveState(response);
          }
        }

        pagination.total = response.total ?? 0;
        list.value = response.list ?? [];

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

    const rowKey = (row: any) => {
      let key: any;
      if (typeof props.rowKey === 'string') {
        key = get(row, props.rowKey);
      } else if (typeof props.rowKey === 'symbol') {
        key = row[props.rowKey];
      } else if (typeof props.rowKey === 'function') {
        key = props.rowKey(row);
      }

      return key;
    };

    const getId = (a: any) => {
      if (props.rowKey == null) {
        throw new Error(`[fat-table] 请配置 rowKey `);
      }

      return rowKey(a);
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
    if (props.requestOnQueryChange || props.requestOnExtraQueryChange) {
      watch(
        () => {
          if (props.requestOnQueryChange) {
            return [query.value, props.extraQuery];
          }

          // 仅仅监听 extraQuery
          return [props.extraQuery];
        },
        () => {
          if ((!ready.value && props.requestOnMounted) || loading.value) {
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
      // 注意：这里是在挂载后初始化的，这么做的好处是可以预留时间给下级组件(比如表单组件)设置初始值
      restoreSetting();

      // 缓存恢复
      if (enableCacheQuery && route?.query?.[queryCacheKey] != null) {
        // 开启了缓存
        // 恢复搜索缓存
        uid = route.query[queryCacheKey] as string;
        restoreFromCache();
      }

      if (enableCacheQuery) {
        // 开启了缓存
        if (route?.query?.[queryCacheKey] != null) {
          if (props.requestOnMounted) {
            await nextTick();
            fetch(true);
          }
        } else {
          // 初始化缓存
          await initialCacheIfNeed();
          if (props.requestOnMounted) {
            await nextTick();
            fetch(true);
          }
        }
      } else if (props.requestOnMounted) {
        fetch(true);
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

    const handleSettingChange = (value: FatTableSettingPayload) => {
      settings.value = value;

      saveSetting();
    };

    /**
     *---------------------------------------+
     *          以下是公开方法                |
     *---------------------------------------+
     */

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

    /**
     * 删除指定行
     */
    const remove = async (...items: any[]): Promise<void> => {
      if (items.length === 0) {
        return undefined;
      }

      const ids = items.map(getId);

      try {
        const confirmBeforeRemoveOptions = createMessageBoxOptions(
          props.confirmBeforeRemove,
          {
            title: t('wkc.alertTitle'),
            message: t('wkc.alertMessage'),
            type: 'warning',
            showCancelButton: true,
          },
          { items, ids }
        );

        if (confirmBeforeRemoveOptions) {
          try {
            await MessageBox(confirmBeforeRemoveOptions);
          } catch (err) {
            // ignore
            return undefined;
          }
        }

        // 开始删除
        if (props.remove == null) {
          throw new Error(t('wkc.fatTableRemoveParamRequired'));
        }

        await props.remove(items, ids);

        // 删除成功提示
        const removedMessageOptions = createMessageOptions(
          props.messageOnRemoved,
          {
            message: t('wkc.deleteSuccess'),
            type: 'success',
          },
          { items, ids }
        );

        if (removedMessageOptions) {
          Message(removedMessageOptions);
        }

        // 移除
        if (props.requestOnRemoved) {
          // 当页最后一条且不是首页，则查询上一页
          if (
            pagination.current > 1 &&
            list.value.length <= items.length &&
            pagination.total <= pagination.pageSize * pagination.current
          ) {
            pagination.current--;
          }
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
            message: t('wkc.deleteFail', { message: (err as Error).message }),
            type: 'error',
          },
          { items, ids, error: err as Error }
        );

        if (removeFailedMessageOptions) {
          Message(removeFailedMessageOptions);
        }

        throw err;
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
      unselectAll();
    };

    const reset = async () => {
      if (formRef.value) {
        formRef.value.reset();
      } else {
        handleReset();
      }
    };

    const doLayout = () => tableRef.value?.doLayout();
    const gotoPage = (page: number) => handlePageCurrentChange(page);

    /**
     * 表格列
     */
    const tableColumns = computed(() => {
      const columns: FatTableColumn<any>[] = (props.columns ?? NoopArray).filter(i => i.type !== 'query');

      // 注入选择行
      if (props.enableSelect && !isSelectionColumnDefined) {
        columns.unshift({
          type: 'selection',
          width: '40',
          selectable: props.selectable,
          className: 'fat-table__selection-cell',
        });
      }

      return columns.map(i => {
        const columnKey = getColumnKey(i) ?? i.type;

        return { ...i, columnKey };
      });
    });

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
      set loading(val: boolean) {
        loading.value = val;
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
      sortByProp(prop, order) {
        tableRef.value?.sort(prop, order);
      },
      clearSort() {
        tableRef.value?.clearSort();
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
      getRequestParams,
      getColumns() {
        return tableColumns.value;
      },
    };

    expose(tableInstance);
    useDevtoolsExpose({
      list,
      selected,
      loading,
      error,
      pagination,
      query,
      sort,
      filter,
    });

    provideAtomicHost(tableInstance);

    const renderTitle = computed(() =>
      hasSlots(props, slots, 'title') || props.title
        ? () => (hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', tableInstance) : props.title)
        : undefined
    );

    const renderNavBar = computed(() => {
      return hasSlots(props, slots, 'navBar') ? () => renderSlot(props, slots, 'navBar', tableInstance) : undefined;
    });

    const queryable = computed(() => props.enableQuery && props.columns.some(isQueryable));

    const tableConfigurableColumns = computed(() => {
      return tableColumns.value.filter(i => i.type !== 'selection' && i.type !== 'expand');
    });

    const isVisible = (columnKey: string | number) => {
      if (!settings.value) {
        return true;
      }

      if (columnKey in settings.value) {
        return settings.value[columnKey].visible;
      }

      // 未配置的可能是新增的字段，默认显示
      return true;
    };

    /**
     * 表单列
     */
    const queryColumns = computed(() => {
      return (props.columns ?? NoopArray)
        .filter(i => i.type === 'query' || i.queryable)
        .map(i => {
          const columnKey = getColumnKey(i);

          return { ...i, columnKey };
        });
    });

    const customizeTableColumns = computed(() => {
      if (!props.enableSetting || settings.value == null) {
        return tableColumns.value;
      }

      return tableColumns.value.filter(i => i.type === 'selection' || i.type === 'expand' || isVisible(i.columnKey!));
    });

    const customizeQueryColumns = computed(() => {
      if (!props.enableSetting || settings.value == null || props.settingProps?.query === false) {
        return queryColumns.value;
      }

      return queryColumns.value.filter(i => {
        // 可见的列 或者 没有在表格列中定义的列
        return isVisible(i.columnKey!);
      });
    });

    const enableQuerySlot = computed(() => {
      return (
        (queryable.value || hasSlots(props, slots, 'beforeForm') || hasSlots(props, slots, 'afterForm')) &&
        !!customizeQueryColumns.value.length
      );
    });

    const renderQuery = computed(() =>
      enableQuerySlot.value
        ? () => [
            renderSlot(props, slots, 'beforeForm', tableInstance),
            queryable.value && (
              <Query
                loading={loading.value}
                initialValue={props.initialQuery}
                formRef={() => formRef}
                query={() => query}
                formProps={props.formProps}
                columns={customizeQueryColumns.value}
                onSubmit={handleSearch}
                onReset={handleReset}
                v-slots={{
                  before() {
                    return renderSlot(props, slots, 'formHeading', tableInstance);
                  },
                  beforeButtons() {
                    return renderSlot(props, slots, 'beforeSubmit', tableInstance);
                  },
                  submitter: hasSlots(props, slots, 'submitter')
                    ? () => {
                        return renderSlot(props, slots, 'submitter', tableInstance);
                      }
                    : undefined,
                  afterButtons() {
                    return renderSlot(props, slots, 'afterSubmit', tableInstance);
                  },
                  after() {
                    return renderSlot(props, slots, 'formTrailing', tableInstance);
                  },
                }}
              ></Query>
            ),
            renderSlot(props, slots, 'afterForm', tableInstance),
          ]
        : undefined
    );

    const renderEmpty = computed(() => {
      return hasSlots(props, slots, 'empty') ? (
        renderSlot(props, slots, 'empty', tableInstance)
      ) : (
        <Empty
          image={props.emptyImage ?? configurable.fatTable?.emptyImage}
          description={props.emptyText ?? configurable.fatTable?.emptyText ?? t('wkc.noDataAvailable')}
          class="fat-table__empty"
        ></Empty>
      );
    });

    const renderToolbar = computed(() => {
      const hasToolbarSlots = hasSlots(props, slots, 'toolbar');
      const batchActions =
        typeof props.batchActions === 'function' ? props.batchActions(tableInstance) : props.batchActions;

      if (hasToolbarSlots || batchActions?.length) {
        return () => {
          const contentOfToolbar = hasToolbarSlots ? renderSlot(props, slots, 'toolbar', tableInstance) : undefined;

          if (batchActions?.length) {
            const actions = (
              <BatchActions
                actions={batchActions}
                tableInstance={tableInstance}
                v-slots={{ default: contentOfToolbar }}
              />
            );

            return actions;
          }

          return contentOfToolbar;
        };
      }

      return undefined;
    });

    const renderSettings = computed(() => {
      return props.enableSetting
        ? () => {
            return (
              <ColumnSetting
                columns={tableConfigurableColumns.value}
                modelValue={settings.value}
                onUpdate:modelValue={handleSettingChange}
              />
            );
          }
        : undefined;
    });

    const renderBottomToolbar = computed(() => {
      return hasSlots(props, slots, 'bottomToolbar')
        ? () => renderSlot(props, slots, 'bottomToolbar', tableInstance)
        : undefined;
    });

    const renderError = computed(() => {
      return error.value && props.enableErrorCapture
        ? () =>
            hasSlots(props, slots, 'error') ? (
              renderSlot(props, slots, 'error')
            ) : (
              <Alert
                title={props.errorTitle ?? configurable.fatTable?.errorTitle ?? t('wkc.dataLoadFailed')}
                type="error"
                showIcon
                description={error.value!.message}
                closable={false}
              />
            )
        : undefined;
    });

    onBeforeUnmount(() => {
      saveCache.cancel();
      debouncedSearch.cancel();
      leadingDebouncedSearch.cancel();
    });

    return () => {
      const layout = props.layout ?? configurable.fatTable?.layout ?? 'default';
      const layoutImpl: FatTableLayout = typeof layout === 'function' ? layout : BUILTIN_LAYOUTS[layout];

      if (layoutImpl == null) {
        throw new Error(`[fat-table]: unknown layout: ${layout}`);
      }

      const columns = customizeTableColumns.value;
      const configurableColumns = tableConfigurableColumns.value;

      // 检查 key 是否唯一, 如果不唯一就抛出异常
      if (props.enableSetting && process.env.NODE_ENV === 'development') {
        const columnKeySet = new Set();

        for (const c of configurableColumns) {
          if (c.columnKey == null) {
            console.log(c);
            throw new Error(`[fat-table]: column key/columnKey/prop is required`);
          }

          if (columnKeySet.has(c.columnKey)) {
            console.log(c);
            throw new Error(`[fat-table]: column key/columnKey/prop must be unique`);
          }

          columnKeySet.add(c.columnKey);
        }
      }

      return layoutImpl({
        rootProps: {
          class: attrs.class,
          style: attrs.style,
        },
        layoutProps: props.layoutProps,
        renderTitle: renderTitle.value,
        renderNavBar: renderNavBar.value,
        renderQuery: renderQuery.value,
        renderError: renderError.value,
        renderToolbar: renderToolbar.value,
        renderSettings: renderSettings.value,
        renderTable: () => [
          renderSlot(props, slots, 'beforeTable', tableInstance),
          // 自定义渲染
          hasSlots(props, slots, 'table') ? (
            renderSlot(props, slots, 'table', {
              table: tableInstance,
              ready: ready.value,
              loading: loading.value,
              sort: toUndefined(sort.value),
              onSortChange: handleSortChange,
              filter,
              onFilterChange: handleFilterChange,
              selection: selected.value,
              onSelectionChange: handleSelectionChange,
              rowKey,
              list: list.value,
              columns,
              ref: tableRef,
              renderEmpty: renderEmpty.value,
              renderTableHeading: () => renderSlot(props, slots, 'tableHeading', tableInstance),
              renderTableTrailing: () => renderSlot(props, slots, 'tableTrailing', tableInstance),

              fatTableProps: props,
              inheritProps: inheritProps(),
            } satisfies FatTableCustomTableScope<any, any>)
          ) : (
            <Table
              {...inheritProps()}
              {...withDirectives([[vLoading, loading.value]])}
              ref={tableRef}
              data={list.value}
              rowKey={rowKey}
              onSelectionChange={handleSelectionChange}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              defaultSort={toUndefined(sort.value)}
              v-slots={{
                empty: renderEmpty.value,
              }}
              class={normalizeClassName([{ 'fat-table--ready': ready.value }])}
            >
              {renderSlot(props, slots, 'tableHeading', tableInstance)}

              {columns?.map((column, index) => {
                return (
                  <Column
                    key={genKey(column, index)}
                    column={column}
                    index={index}
                    filter={filter}
                    columnMinWidth={props.columnMinWidth}
                    columnWidth={props.columnWidth}
                    tableInstance={tableInstance}
                  />
                );
              })}

              {renderSlot(props, slots, 'tableTrailing', tableInstance)}
            </Table>
          ),
          renderSlot(props, slots, 'afterTable', tableInstance),
        ],
        renderBottomToolbar: renderBottomToolbar.value,
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

export const FatTable = FatTableInner as unknown as new <Item extends {} = any, Query extends {} = any>(
  props: FatTableProps<Item, Query>
) => OurComponentInstance<
  typeof props,
  FatTableSlots<Item, Query>,
  FatTableEvents<Item, Query>,
  FatTableMethods<Item, Query>
>;
