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
} from '@wakeadmin/element-adapter';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { computed, ref, set as $set } from '@wakeadmin/demi';
import { Inquiry } from '@wakeadmin/icons';
import { get, isObject, NoopArray, set, cloneDeep } from '@wakeadmin/utils';
import memoize from 'lodash/memoize';

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

import { FatFormItemProps, FatFormGroupSlots, FatFormGroupProps } from './types';
import { FatFormGroup } from './fat-form-group';
import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormItem } from './fat-form-item';
import { formItemWidth, runInModifyContext, validateFormItemProps } from './utils';

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
   * 自定义操作栏，可以在这里使用 el-table-column
   */
  renderActions?: (inst: FatFormTableMethods) => any;
}

export function useFatFormTableRef<Store extends {} = any>() {
  return ref<FatFormTableMethods<Store>>();
}

export interface FatFormTableColumn<
  Store extends {} = any,
  Request extends {} = Store,
  ValueType extends keyof AtomicProps = 'text'
> extends CommonProps,
    Omit<FatFormItemProps<Store, Request, ValueType>, 'renderLabel' | 'renderTooltip'> {
  renderLabel?: (inst: FatFormTableMethods) => any;
  renderTooltip?: (inst: FatFormTableMethods) => any;
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
   * 是否支持创建, 默认 true
   */
  enableCreate?: boolean;

  /**
   * 创建文本， 默认为 ’新增‘
   */
  createText?: string;

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
   * 自定义创建逻辑
   * 可以抛出异常来终止创建
   * 如果返回一个对象，将作为新子项插入到队列尾部
   *
   * 如果要自定义复杂的创建逻辑，比如插入到队列前面，可以关闭 enableCreate, 并自己实现
   */
  beforeCreate?: () => any;
}

const AUTO_UNIQ_KEY: unique symbol = Symbol('AUTO_UNIQ_KEY');

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
    columnAlign: null,
    columnHeaderAlign: null,

    enableCreate: { type: Boolean, default: true },
    beforeCreate: null,

    createText: String,
    moveUpText: String,
    moveDownText: String,
    removeText: String,
    actionText: String,

    createProps: null,
    removeConfirm: null,

    // 自定义操作栏
    renderActions: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormTableSlots<any>>>(),
  setup(props, { slots, expose, attrs }) {
    validateFormItemProps(props, 'fat-form-table');
    const form = useFatFormContext()!;
    const tableRef = ref();
    const inherited = useInheritableProps();

    const mode = computed(() => {
      return props.mode ?? inherited?.mode;
    });

    const editable = computed(() => {
      return mode.value !== 'preview';
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

    const rawValue = computed(() => {
      return form.getFieldValue(props.prop);
    });

    const value = computed<any[]>(() => {
      return rawValue.value ?? NoopArray;
    });

    const exceeded = computed(() => {
      return value.value.length >= props.max!;
    });

    const getValue = () => {
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

    const remove = (row: any) => {
      const list = rawValue.value! as any[];
      const idx = list.indexOf(row);

      if (idx !== -1) {
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

      if (props.sortable) {
        list.push(
          {
            name: props.moveUpText ?? '上移',
            visible: index > 0,
            onClick: () => {
              moveUp(row);
            },
          },
          {
            name: props.moveDownText ?? '下移',
            visible: index < value.value.length - 1,
            onClick: () => {
              moveDown(row);
            },
          }
        );
      }

      list.push({
        name: props.removeText ?? '删除',
        confirm: createMessageBoxOptions(
          props.removeConfirm,
          {
            title: '提示',
            message: '确认删除?',
            type: 'warning',
            showCancelButton: true,
          },
          { instance }
        ),
        onClick: () => {
          remove(row);
        },
      });

      return list;
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
          label={props.actionText ?? '操作'}
          width={props.actionWidth ?? (props.sortable ? 180 : 80)}
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
              {...props.tableProps}
              class={normalizeClassName('fat-form-table__table', props.tableProps?.class)}
            >
              {props.columns?.map((col, idx) => {
                const { tooltip, prop, renderTooltip, renderLabel, label, ...other } = col;
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
                          <Inquiry class="fat-form-tooltip" />
                        </Tooltip>
                      )}
                    </span>
                  );
                }

                const children = {
                  default: (scope: { row: any; $index: number }) => {
                    // 自定义渲染
                    const index = scope.$index;
                    const finalProp = `${props.prop}[${index}].${prop}`;

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
                  {props.createText ?? '新增'}
                </Button>
              </div>
            )}
          </div>
        </FatFormGroup>
      );
    };
  },
});
