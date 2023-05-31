/**
 * 动态表格增删
 */
import {
  CommonProps,
  TableProps,
  Table,
  TableColumn,
  Tooltip,
  Button,
  size,
  ButtonProps,
  Message,
  TableColumnProps,
} from '@wakeadmin/element-adapter';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref, set as $set, ComponentPublicInstance, watchPostEffect } from '@wakeadmin/demi';
import { InquiryFill } from '@wakeadmin/icons';
import { get, isObject, NoopArray, set, cloneDeep } from '@wakeadmin/utils';
import memoize from 'lodash/memoize';
import Sortable from 'sortablejs';

import { FatAction, FatActions } from '../fat-actions';
import {
  createMessageBoxOptions,
  hasSlots,
  inheritProps,
  LooseMessageBoxOptions,
  normalizeClassName,
  pickEnumerable,
  renderSlot,
  ToHSlotDefinition,
} from '../utils';

import { FatFormItemProps, FatFormGroupSlots, FatFormGroupProps, FatFormMethods } from './types';
import { FatFormGroup } from './fat-form-group';
import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormItem } from './fat-form-item';
import { formItemWidth, runInModifyContext, validateFormItemProps } from './utils';
import { useT } from '../hooks';

export interface FatFormTableMethods<Store extends {} = any> {
  /**
   * 上移
   * @param item
   */
  moveUp(item: any): void;

  /**
   * 当前值
   */
  getValue(): any;

  /**
   * 设置值
   */
  setValue(value: any[]): void;

  /**
   * 下移
   * @param item
   */
  moveDown(item: any): void;

  /**
   * 删除
   */
  remove(item: any): void;

  /**
   * 创建新的子项
   */
  create(): void;
}

export interface FatFormTableSlots<Store extends {} = any> extends Omit<FatFormGroupSlots<Store>, 'renderDefault'> {
  renderDefault?: (inst: FatFormTableMethods) => any;

  /**
   * 自定义列
   */
  renderColumns?: (inst: FatFormTableMethods) => any;

  /**
   * 自定义操作栏，可以在这里使用 el-table-column
   */
  renderActions?: (inst: FatFormTableMethods) => any;
}

export function useFatFormTableRef<Store extends {} = any>() {
  return ref<FatFormTableMethods<Store>>();
}

export interface FatFormTableColumnMethods<Store extends {} = any> {
  form: FatFormMethods<Store>;
  table: FatFormTableMethods<Store>;
  itemProps: FatFormItemProps;
  /**
   * 当前行的数据
   */
  row: any;

  /**
   * 当前字段的数据
   */
  value: any;
  /**
   * 父级的 prop
   */
  parentProp: string;
  prop: string;
  index: number;
}

export interface FatFormTableColumn<
  Store extends {} = any,
  Request extends {} = Store,
  ValueType extends keyof AtomicProps = 'text'
> extends CommonProps,
    Omit<FatFormItemProps<Store, Request, ValueType>, 'renderLabel' | 'renderTooltip'> {
  /**
   * el-table-column 的 props
   */
  tableColumnProps?: TableColumnProps;
  renderColumn?: (inst: FatFormTableColumnMethods<Store>) => any;
  renderLabel?: (inst: FatFormTableMethods<Store>) => any;
  renderTooltip?: (inst: FatFormTableMethods<Store>) => any;
}

export const FatFormTableDropGuide = {
  Prevent: false,
  InsertBefore: -1,
  InsertAfter: 1,
  Ok: true,
};

/**
 * 排序的方式
 */
export enum FatFormTableSortType {
  ByDrag = 'by-drag',
  ByAction = 'by-action',
}

export interface FatFormTableSortableOptions<Store extends {} = any> {
  /**
   * 排序的方式，默认是 FatFormTableSortType.ByAction
   */
  type?: FatFormTableSortType;

  /**
   * 确定行是否可以被排序
   * @returns
   */
  rowSortable?: (params: { row: Store; index: number; list: Store[] }) => boolean;

  /**
   * 拖拽块选择器
   * 默认整行可以进行拖拽
   * @note 只有拖拽排序的方式支持该方法
   */
  handle?: string;

  /**
   * 判断是否可以放置
   * @note 只有拖拽排序的方式支持该方法
   * @returns 可以使用 FatFormTableDropGuide
   *  return false; — for cancel
   *  return -1; — insert before target
   *  return 1; — insert after target
   *  return true; — keep default insertion point based on the direction
   *  return void; — keep default insertion point based on the direction
   */
  canDrop?: (params: {
    /**
     * sortable 原始 move 事件类型
     */
    nativeMoveEvent: Sortable.MoveEvent;
    nativeEvent: Event;

    /**
     * 当前正在拖拽的子项
     */
    dragged: Store;

    /**
     * dragged 对应的索引
     */
    draggedIndex: number;

    /**
     * 即将释放的参考元素
     */
    related: Store;

    /**
     * related 对应的索引
     */
    relatedIndex: number;

    /**
     * 是否插入到 related 之前
     */
    willInsertAfter?: boolean;

    /**
     * 完整的列表
     */
    list: Store[];
  }) => false | -1 | 1 | true | void;

  /**
   * 是否忽略 form mode，默认 false
   * 默认情况下，mode === preview 时不允许拖拽
   */
  ignoreMode?: boolean;
}

export interface FatFormTableProps<Store extends {} = any, Request extends {} = Store>
  extends Omit<FatFormGroupProps<Store>, keyof FatFormGroupSlots<any>>,
    FatFormTableSlots<Store> {
  /**
   * 透传给 el-table 的属性
   */
  tableProps?: TableProps & CommonProps;

  /**
   * 子项 key
   */
  rowKey?: TableProps['rowKey'];

  /**
   * 字段路径。例如 a.b.c、b[0]
   */
  prop: string;

  /**
   * 表单项
   */
  columns: FatFormTableColumn<Store, Request, any>[];

  /**
   * 子项大小限制，默认不限制
   */
  max?: number;

  /**
   * 表单 column 对齐方式, 默认 left
   */
  columnAlign?: 'left' | 'right' | 'center';

  /**
   * 表单 columnHeader 对齐方式，默认 left
   */
  columnHeaderAlign?: 'left' | 'right' | 'center';

  /**
   * 是否可排序, 默认 false
   */
  sortable?: boolean;

  /**
   * 排序配置
   */
  sortableProps?: FatFormTableSortableOptions<Store>;

  /**
   * 是否支持创建, 默认 true
   */
  enableCreate?: boolean;

  /**
   * 创建文本， 默认为 ’新增‘
   */
  createText?: any;

  /**
   * 创建按钮的自定义属性
   */
  createProps?: ButtonProps;

  /**
   * 上移文本，默认为 ’上移‘
   */
  moveUpText?: string;

  /**
   * 下移文本，默认为 ’下移‘
   */
  moveDownText?: string;

  /**
   * 删除文本，默认为 '删除'
   */
  removeText?: string;

  /**
   * 操作文本，默认为 '操作'
   */
  actionText?: string;

  /**
   * 操作列的宽度, 默认 180px
   */
  actionWidth?: number;

  /**
   * 删除确认配置, 默认为 确认删除？
   */
  removeConfirm?: LooseMessageBoxOptions<{ instance: FatFormTableMethods }>;

  /**
   * 是否支持删除
   * @param params
   * @returns
   */
  removable?: (params: { item: any; index: number; list: any[] }) => boolean;

  /**
   * 自定义创建逻辑
   * 可以抛出异常来终止创建
   * 如果返回一个对象，将作为新子项插入到队列尾部
   *
   * 如果要自定义复杂的创建逻辑，比如插入到队列前面，可以关闭 enableCreate, 并自己实现
   */
  beforeCreate?: () => any;

  /**
   * 删除前触发，可以返回 false 或抛出异常 阻止提交
   * @param item
   * @returns
   */
  beforeRemove?: (item: any) => Promise<boolean | void>;
}

const AUTO_UNIQ_KEY: unique symbol = Symbol('AUTO_UNIQ_KEY');
const ROW_DISABLE_TO_DRAG = 'disable-to-drag';
const UUID_CLASS_REG = /row-uuid-([^\s]+)/;

const parseWidth = memoize((width: string | number) => {
  const value = formItemWidth(width as any);

  // 解析 CSS variable
  if (typeof value === 'string' && value.startsWith('var(')) {
    const name = value.slice(4, -1);
    return getComputedStyle(document.body).getPropertyValue(name);
  }

  return value;
});

export const FatFormTable = declareComponent({
  name: 'FatFormTable',
  props: declareProps<FatFormTableProps<any, any>>({
    prop: String,
    mode: null,
    tableProps: null,
    rowKey: null,
    columns: null,
    max: { type: Number, default: Number.MAX_SAFE_INTEGER },
    actionWidth: { type: Number, default: undefined },
    sortable: Boolean,
    sortableProps: null,
    columnAlign: null,
    columnHeaderAlign: null,

    enableCreate: { type: Boolean, default: true },
    beforeCreate: null,
    removable: null,
    beforeRemove: null,

    createText: null,
    moveUpText: String,
    moveDownText: String,
    removeText: String,
    actionText: String,

    createProps: null,
    removeConfirm: null,

    // 自定义操作栏
    renderActions: null,
    renderColumns: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormTableSlots<any>>>(),
  setup(props, { slots, expose, attrs }) {
    validateFormItemProps(props, 'fat-form-table');
    const form = useFatFormContext()!;
    const t = useT();
    const tableRef = ref<ComponentPublicInstance>();
    const inherited = useInheritableProps();

    const mode = computed(() => {
      return props.mode ?? inherited?.mode;
    });

    const editable = computed(() => {
      return mode.value !== 'preview';
    });

    /**
     * 拖拽的方式
     */
    const sortType = computed(() => {
      return props.sortableProps?.type ?? FatFormTableSortType.ByAction;
    });

    /**
     * 是否支持排序
     */
    const sortable = computed(() => {
      return props.sortable && (props.sortableProps?.ignoreMode || editable.value);
    });

    const rowKey = (row: any) => {
      let key: any;
      if (typeof props.rowKey === 'string') {
        key = get(row, props.rowKey);
      } else if (typeof props.rowKey === 'function') {
        key = props.rowKey(row);
      }

      if (key == null) {
        return row[AUTO_UNIQ_KEY];
      }

      return key;
    };

    const rawValue = computed<any[] | undefined>(() => {
      return form.getFieldValue(props.prop);
    });

    const value = computed<any[]>(() => {
      return rawValue.value ?? NoopArray;
    });

    const exceeded = computed(() => {
      return value.value.length >= props.max!;
    });

    const getValue = (): any[] => {
      const val = rawValue.value;

      // 初始化
      if (!Array.isArray(val)) {
        form.setFieldValue(props.prop, []);

        return form.getFieldValue(props.prop);
      }

      return val;
    };

    const moveUp = (row: any) => {
      const list = rawValue.value! as any[];
      const idx = list.indexOf(row);

      if (idx > 0) {
        const targetIdx = idx - 1;
        const target = list[targetIdx];
        const item = list[idx];

        runInModifyContext(() => {
          $set(list, targetIdx, item);
          $set(list, idx, target);
        });
      }
    };

    const moveDown = (row: any) => {
      const list = rawValue.value! as any[];
      const idx = list.indexOf(row);

      if (idx !== -1 && idx < list.length - 1) {
        const targetIdx = idx + 1;
        const target = list[targetIdx];
        const item = list[idx];

        runInModifyContext(() => {
          $set(list, targetIdx, item);
          $set(list, idx, target);
        });
      }
    };

    /**
     * 交换数据的位置
     */
    const swap = (oldIndex: number, newIndex: number) => {
      const clone = value.value.slice(0);
      const oldItem = clone.splice(oldIndex, 1)[0];
      clone.splice(newIndex, 0, oldItem);

      runInModifyContext(() => {
        form.setFieldValue(props.prop, clone);
      });
    };

    const remove = async (row: any) => {
      const list = rawValue.value! as any[];
      const idx = list.indexOf(row);

      if (idx !== -1) {
        const item = list[idx];

        if ((await props.beforeRemove?.(item)) === false) {
          // 取消删除
          return;
        }

        runInModifyContext(() => {
          list.splice(idx, 1);
        });
      }
    };

    /**
     * 创建一条新项目
     */
    const create = () => {
      if (exceeded.value) {
        return;
      }

      try {
        const uid = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
        if (props.beforeCreate) {
          const item = props.beforeCreate();
          item[AUTO_UNIQ_KEY] = uid;

          if (isObject(item)) {
            const list = getValue();

            runInModifyContext(() => {
              list.push(item);
            });
            return;
          }
        }

        // 默认创建逻辑
        const item = {
          // 隐藏的唯一 id
          [AUTO_UNIQ_KEY]: uid,
        };

        props.columns?.forEach(i => {
          if (i.initialValue !== undefined) {
            set(item, i.prop, cloneDeep(i.initialValue));
          } else {
            set(item, i.prop, undefined);
          }
        });

        const list = getValue();

        runInModifyContext(() => {
          list.push(item);
        });
      } catch (err) {
        console.error(err);
        Message.error((err as Error).message);
      }
    };

    const instance: FatFormTableMethods = {
      getValue,

      setValue(newValue: any) {
        if (!Array.isArray(newValue)) {
          throw new Error(`[fat-form-table] Invalid value type, expect array`);
        }
        form.setFieldValue(props.prop, newValue);
      },
      moveUp,
      moveDown,
      remove,
      create,
    };

    const getActions = (row: any, index: number) => {
      const list: FatAction[] = [];

      if (sortable.value && sortType.value === FatFormTableSortType.ByAction) {
        const rowSortable = props.sortableProps?.rowSortable?.({ row, index, list: getValue() }) ?? true;

        list.push(
          {
            name: props.moveUpText ?? t('wkc.moveUp'),
            visible: index > 0 && rowSortable,
            onClick: () => {
              moveUp(row);
            },
          },
          {
            name: props.moveDownText ?? t('wkc.moveDown'),
            visible: index < value.value.length - 1 && rowSortable,
            onClick: () => {
              moveDown(row);
            },
          }
        );
      }

      list.push({
        name: props.removeText ?? t('wkc.delete'),
        confirm: createMessageBoxOptions(
          props.removeConfirm,
          {
            title: t('wkc.alertTitle'),
            message: t('wkc.confirmDelete'),
            type: 'warning',
            showCancelButton: true,
          },
          { instance }
        ),
        visible: () => {
          return editable.value && (props.removable?.({ index, item: row, list: getValue() }) ?? true);
        },
        onClick: () => {
          remove(row);
        },
      });

      return list;
    };

    /**
     * 生成行类名
     * @param scope
     * @returns
     */
    const generateRowClassName = (scope: { row: any; rowIndex: number }) => {
      const classNames = [];
      if (props.sortableProps?.rowSortable) {
        const result = props.sortableProps.rowSortable({ row: scope.row, index: scope.rowIndex, list: getValue() });
        if (!result) {
          classNames.push(ROW_DISABLE_TO_DRAG);
        }
      }

      if (sortable.value) {
        // 给每一行注入唯一的 id
        const id = rowKey(scope.row);
        classNames.push(`row-uuid-${id}`);
      }

      return classNames.filter(Boolean).join(' ');
    };

    const renderActions = computed(() => {
      if (!editable.value) {
        return undefined;
      }

      if (hasSlots(props, slots, 'actions')) {
        return () => renderSlot(props, slots, 'actions', instance);
      }

      return () => (
        <TableColumn
          label={props.actionText ?? t('wkc.operation')}
          width={props.actionWidth ?? (sortable.value ? 180 : 80)}
          align={props.columnAlign}
          headerAlign={props.columnHeaderAlign}
        >
          {{
            default: (scope: { row: any; $index: number }) => {
              return <FatActions options={getActions(scope.row, scope.$index)} />;
            },
          }}
        </TableColumn>
      );
    });

    // 拖拽排序
    watchPostEffect(onCleanup => {
      if (!sortable.value || sortType.value !== FatFormTableSortType.ByDrag) {
        return;
      }

      const tableElement = tableRef.value?.$el;
      const tbody = tableElement?.querySelector('tbody');

      if (!tbody) {
        return;
      }

      const getUUIDFromElement = (el: HTMLElement) => {
        const matched = el.className.match(UUID_CLASS_REG);
        const id = matched?.[1];

        if (id == null) {
          throw new Error(`[fat-form-table] Can not find uuid from element(${el.className})`);
        }

        return id;
      };

      const getItemByUUID = (uuid: string) => {
        const list = getValue();
        const idx = list.findIndex(i => String(rowKey(i)) === uuid);

        if (idx === -1) {
          throw new Error(`[fat-form-table] Can not find item by uuid(${uuid})`);
        }

        return {
          index: idx,
          value: list[idx],
        };
      };

      const sortableInstance = Sortable.create(tbody, {
        handle: props.sortableProps?.handle,
        // 禁用移动的行
        filter: `.${ROW_DISABLE_TO_DRAG}`,
        preventOnFilter: false,

        /**
         * 决定是否能够拖入
         * @param evt
         * @param nativeEvent
         * @returns
         */
        onMove: (evt, nativeEvent) => {
          const { index: draggedIndex, value: dragged } = getItemByUUID(getUUIDFromElement(evt.dragged));
          const { index: relatedIndex, value: related } = getItemByUUID(getUUIDFromElement(evt.related));

          return props.sortableProps?.canDrop?.({
            nativeMoveEvent: evt,
            nativeEvent,
            draggedIndex,
            dragged,
            relatedIndex,
            related,
            willInsertAfter: evt.willInsertAfter,
            list: getValue(),
          });
        },

        /**
         * 完成排序
         * @param evt
         */
        onEnd: evt => {
          const { oldIndex, newIndex } = evt;
          swap(oldIndex!, newIndex!);
        },
      });

      onCleanup(() => {
        sortableInstance.destroy();
      });
    });

    expose(instance);

    return () => {
      return (
        <FatFormGroup
          prop={props.prop}
          mode={props.mode}
          v-slots={pickEnumerable(slots, 'default', 'actions')}
          bareness
          {...inheritProps(false)}
          class={normalizeClassName('fat-form-table', attrs.class, {
            'fat-form-table__editable': editable.value,
          })}
        >
          <div class="fat-form-table__body">
            <Table
              rowKey={rowKey}
              data={value.value}
              size={size('default')}
              border
              ref={tableRef}
              rowClassName={generateRowClassName}
              {...props.tableProps}
              class={normalizeClassName('fat-form-table__table', props.tableProps?.class)}
            >
              {renderSlot(props, slots, 'columns', instance)}
              {props.columns?.map((col, idx) => {
                const { tooltip, prop, renderTooltip, renderLabel, renderColumn, label, tableColumnProps, ...other } =
                  col;
                let renderHeader: (() => any) | undefined;

                const hasTooltip = !!(tooltip || renderTooltip);
                const hasLabelSlot = !!renderLabel;

                if (hasTooltip || hasLabelSlot) {
                  renderHeader = () => (
                    <span>
                      {renderLabel?.(instance)}
                      {label}
                      {hasTooltip && (
                        <Tooltip
                          v-slots={{
                            content: renderTooltip ? renderTooltip(instance) : tooltip,
                          }}
                        >
                          <InquiryFill class="fat-form-tooltip" />
                        </Tooltip>
                      )}
                    </span>
                  );
                }

                const children = {
                  default: (scope: { row: any; $index: number }) => {
                    // 自定义渲染
                    const index = scope.$index;
                    const parentProp = `${props.prop}[${index}]`;
                    const finalProp = `${parentProp}.${prop}`;
                    const itemProps = {
                      prop: finalProp,
                      ...other,
                    };

                    // 自定义渲染
                    if (typeof renderColumn === 'function') {
                      return renderColumn({
                        form,
                        prop: finalProp,
                        table: instance,
                        parentProp,
                        itemProps,
                        index,
                        row: scope.row,
                        value: scope.row[prop],
                      });
                    }

                    return <FatFormItem prop={finalProp} {...other} />;
                  },
                };

                const width = col.width && parseWidth(col.width);

                return (
                  <TableColumn
                    key={idx}
                    label={label}
                    renderHeader={renderHeader}
                    align={props.columnAlign}
                    headerAlign={props.columnHeaderAlign}
                    width={width}
                    {...tableColumnProps}
                  >
                    {children}
                  </TableColumn>
                );
              })}
              {renderActions.value?.()}
            </Table>
            {renderSlot(props, slots, 'default', instance)}
            {!editable.value || !props.enableCreate ? undefined : (
              <div class="fat-form-table__footer">
                <Button type="text" {...props.createProps} onClick={create} disabled={exceeded.value}>
                  {props.createText ?? t('wkc.add')}
                </Button>
              </div>
            )}
          </div>
        </FatFormGroup>
      );
    };
  },
});
