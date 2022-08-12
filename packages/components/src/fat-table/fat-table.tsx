import { Table, TableColumn, Pagination } from '@wakeadmin/component-adapter';
import { VNode, ref, onMounted, reactive } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { NoopObject } from '@wakeadmin/utils';

import { AtomicCommonProps } from '../atomic';
import { useAtomicRegistry } from '../hooks';
import { PaginationProps, DEFAULT_PAGINATION_PROPS } from '../definitions';

export interface FatTableRequestParams {}

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
export interface FatTableProps<T extends {}> {
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
  request: (params: FatTableRequestParams) => Promise<FatTableRequestResponse<T>>;

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
   * 是否开启分页展示, 默认开启
   */
  enablePagination?: boolean;

  /**
   * 分页配置
   */
  paginationProps?: PaginationProps;
}

const FatTableInner = declareComponent({
  name: 'FatTable',
  props: declareProps<FatTableProps<any>>(['showError', 'request', 'remove', 'columns', 'rowKey']),
  slots: declareSlots<{ beforeColumns: never; afterColumns: never }>(),
  setup(props, { slots }) {
    // const uid = `${Math.random().toFixed(4).slice(-4)}_${Date.now()}`;
    const list = ref([]);
    const loading = ref(false);
    // const ready = ref(false);
    // const error = ref<Error | null>(null);
    const atomics = useAtomicRegistry();

    // 分页状态
    const pagination = reactive({
      total: 0,
      current: 1,
      pageSize: props.paginationProps?.pageSize ?? DEFAULT_PAGINATION_PROPS.pageSize ?? 10,
    });

    const handlePageSizeChange = (value: number) => {
      pagination.pageSize = value;
    };

    const handlePageCurrentChange = (value: number) => {
      pagination.current = value;
    };

    onMounted(() => {});

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

              let slots: any;

              if (type === 'default' || type === 'expand') {
                slots = {
                  default: (scope: { row: any; $index: number }) => {
                    // 自定义渲染
                    const prop = column.prop;
                    const row = scope.row;
                    const index = scope.$index;
                    const value = prop ? row[prop] : undefined;

                    if (column.render) {
                      return column.render(value, row, index);
                    } else {
                      // 按照 valueType 渲染
                      const comp = atomics.registered(valueType);
                      if (comp == null) {
                        throw new Error(`[fat-table] 未能识别类型为 ${valueType} 的原件`);
                      }

                      const Comp = comp.component;

                      return <Comp mode="preview" value={value} {...valueProps} />;
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
                  {slots}
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
              onSize-change={handlePageSizeChange}
              onCurrent-change={handlePageCurrentChange}
            ></Pagination>
          )}
        </div>
      );
    };
  },
});

export const FatTable = FatTableInner as any as <T extends {}>(props: FatTableProps<T>) => VNode;
