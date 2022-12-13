import { computed, nextTick, onUnmounted, provide, ref } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps } from '@wakeadmin/h';
import { Noop, pick } from '@wakeadmin/utils';

import { SelectionModel, SelectionModelChange } from '../collections/selection';
import { useFatConfigurable } from '../fat-configurable';
import { FatTableInstanceContext, FatTablePublicMethodKeys } from '../fat-table/constants';
import { FatTable } from '../fat-table/fat-table';
import { useFatTableRef } from '../fat-table/hooks';
import { FatTableEvents, FatTableMethods, FatTableProps, FatTableRemove, FatTableSlots } from '../fat-table/types';
import { useDevtoolsExpose } from '../hooks';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  OurComponentInstance,
  renderSlot,
  toArray,
  ToHEmitDefinition,
} from '../utils';

const IgnoreFatTableProps = {
  confirmBeforeRemove: null,
  messageOnRemoved: null,
  messageOnRemoveFailed: null,
  remove: null,
  requestOnRemoved: null,
  enableSelect: null,
  selectable: null,
  onSelect: null,
  'onSelect-all': null,
  onLoad: null,
} as const;

export const FatTableSelectPublicMethodKeys = [
  'getSelected',
  'clear',
  'select',
  'selectAll',
  'unselect',
  'unselectAll',
  'toggle',
  'toggleAll',
  'removeSelected',
  'remove',
] as const;

type FatTableSelectInstanceExposeMethods = Record<typeof FatTableSelectPublicMethodKeys[number], Function>;
type IgnoreFatTablePropsKeys = keyof typeof IgnoreFatTableProps;

export interface FatTableSelectMethods<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends Omit<FatTableMethods<Item, Query>, 'selected' | 'select' | 'unselect' | 'selectAll' | 'unselectAll'> {
  /**
   * 选中指定值
   * @param values 选择值
   */
  select(...values: (string | number)[]): void;
  /**
   * 取消指定值
   * @param values 选择值
   */
  unselect(...values: (string | number)[]): void;

  /**
   * 切换选择状态
   * @param values
   */
  toggle(...values: (string | number)[]): void;

  /***
   * 全选当前页
   */
  selectAll(): void;
  /**
   * 取消全选当前页
   */
  unselectAll(): void;

  /**
   * 清空所选项
   */
  clear(): void;

  /**
   * 获取所选项
   */
  getSelected(): Selection[];
  /**
   * 获取当前页选中的数据列表
   */
  getCurrentPageSelected: () => Selection[];
}

export interface FatTableSelectSlots<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends Omit<FatTableProps<Item, Query>, 'renderBottomToolbar'> {
  renderBottomToolbar?(instance: FatTableSelectMethods<Item, Query, Selection>, selectedList: Selection[]): any;
}
export interface FatTableSelectEvents<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends FatTableEvents<Item, Query> {
  onChange?(payload: SelectionModelChange<Selection>): void;

  onInput?(value: Selection | Selection[]): void;
}

export interface FatTableSelectProps<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends Omit<
      FatTableProps<Item, Query>,
      | keyof FatTableRemove<Item>
      | 'renderBottomToolbar'
      | 'rowKey'
      | 'namespace'
      | 'enableCacheQuery'
      | 'removeSelected'
      | IgnoreFatTablePropsKeys
    >,
    FatTableSelectEvents<Item, Query, Selection>,
    FatTableSelectSlots<Item, Query, Selection> {
  rowKey: keyof Omit<Item, symbol | number>;
  /**
   * 是否多选
   *
   * @remarks
   * 该模式下 如果用户没有指定 `selection`列
   *
   * 那么会自动添加一个到首列
   */
  multiple?: boolean;

  /**
   * 已选择的值
   */
  value?: Selection[] | Selection;

  /**
   * 最多允许选择多少项
   * @remarks
   * 只有在 `multiple` 为 `true` 时才会生效
   */
  limit?: number;

  /**
   * 是否允许操作
   *
   * @remarks
   * - 如果传入一个字符串 会从传入的对象里去取该值
   * - 单选模式下 如果用户传入`actions`列 那么需要自行判断
   *
   */
  disabled?: string | ((row: Item, selected: boolean) => boolean);

  /**
   *
   * 选择按钮的内容
   *
   * 默认为 `选择`
   * @remarks
   * 单选模式下 如果用户没有手动指定`actions`列的话 那么会自动添加一列`actions`列来进行处理选择操作
   *
   * 用户可以传入一个`string`或者是一个jsx对象来控制该列的显示内容
   */
  selectActionText?: any;
}

class FatTableSelectError extends Error {
  constructor(message: string) {
    super(`[@wakeadmin/components fat-table-select] ${message}`);
  }
}

function toId(row: any, key: string): string {
  if (row == null) {
    throw new FatTableSelectError(`无法获取对应的id`);
  }

  if (typeof row === 'object') {
    if (key in row) {
      return row[key];
    }
    throw new FatTableSelectError(`row 对象中不存在对应的 key[${key}] `);
  }
  return row;
}

function toIds(rows: any, key: string): string[] {
  return toArray(rows).map(item => toId(item, key));
}

function createPickFn<Values extends {}, Row extends Values>(
  rowKey: string,
  value: Values
): (source: Row & Record<string, any>) => Values;
function createPickFn<Values extends number | string, Row extends {}>(
  rowKey: string,
  value: Values
): (source: Row & Record<string, any>) => Values;
function createPickFn<Values extends undefined, Row extends {}>(
  rowKey: string
): (source: Row & Record<string, any>) => Row;
function createPickFn<Values extends Row | number | string, Row extends {}>(
  rowKey: string,
  value?: Values
): (source: Row & Record<string, any>) => Values | Row {
  if (value == null) {
    return source => source;
  }
  if (typeof value !== 'object') {
    return source => toId(source, rowKey) as any as Values;
  }

  const keys = Object.keys(value);

  return source => pick(source, keys) as any as Values;
}

export const FatTableSelectInner = declareComponent({
  name: 'FatTableSelect',
  props: declareProps<Omit<FatTableSelectProps<any, any, any>, keyof FatTableSelectEvents<any, any, any>>>({
    rowKey: {
      required: true,
    },
    limit: {
      default: Infinity,
      type: Number,
    },
    multiple: {
      default: false,
      type: Boolean,
    },
    value: null,

    disabled: null,

    selectActionText: null,

    // slots
    renderBottomToolbar: null,

    // fat table overwrite
    columns: null,

    // @ts-expect-error
    modelValue: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatTableSelectEvents<any, any, any>>>(),
  setup(props, { expose, emit, slots }) {
    const itemStore = new Map<string, any>();

    const fatTableRef = useFatTableRef();

    const globalConfiguration = useFatConfigurable();

    // @ts-expect-error
    const modelValue = props.modelValue ?? props.value;

    const model = new SelectionModel(props.multiple, toIds(modelValue, props.rowKey), props.limit);

    if (modelValue) {
      toArray(modelValue).forEach(item => itemStore.set(toId(item, props.rowKey), item));
    }

    const selectedList = ref<any[]>(toArray(modelValue));
    const selectedCount = computed(() => selectedList.value.length);

    const isDisabled = computed(() => {
      const disabled = props.disabled;
      const rowKey = props.rowKey;

      if (disabled == null) {
        return () => false;
      }

      if (typeof disabled === 'string') {
        return (row: any) => !!row[disabled];
      }

      if (typeof disabled === 'function') {
        return (row: any) => {
          const id = toId(row, rowKey);
          return disabled(row, model.isSelected(id));
        };
      }

      throw new FatTableSelectError(`disabled 必须是一个 字符串 或者 函数`);
    });

    const columns = computed(() => {
      const propsColumns = props.columns;
      const hasAction = propsColumns.some(column => column.type === 'actions');
      if (!(hasAction || props.multiple)) {
        return propsColumns.concat([
          {
            type: 'actions',
            label: '操作',
            actions: [
              {
                name: props.selectActionText ?? globalConfiguration.fatTableSelect?.selectActionText ?? '选择',
                disabled(_, row) {
                  return isDisabled.value(row);
                },
                onClick: (_, row) => {
                  // eslint-disable-next-line @typescript-eslint/no-use-before-define
                  select(row);
                },
              },
            ],
          },
        ]);
      }
      return propsColumns;
    });

    const transformValue = createPickFn(props.rowKey, Array.isArray(modelValue) ? modelValue[0] : modelValue);

    const dispose = model.subscribe(({ values, added, removed }) => {
      const valuesItem = values.map(value => itemStore.get(value));
      const removedItem = removed.map(value => itemStore.get(value));
      const addedItem = added.map(value => itemStore.get(value));

      if (removedItem.length > 0) {
        fatTableRef.value!.unselect(...removedItem);
      }

      if (addedItem.length > 0) {
        fatTableRef.value!.select(...addedItem);
      }

      const data = valuesItem.map(transformValue);

      emit('change', {
        values: data,
        added: addedItem.map(transformValue),
        removed: removedItem.map(transformValue),
      });

      emit('update:modelValue' as any, props.multiple ? data : data[0]);

      selectedList.value = data;
    });

    onUnmounted(() => {
      dispose();
    });

    const selectable = (row: any) => {
      const disabled = isDisabled.value(row);
      if (disabled) {
        return false;
      }

      const id = toId(row, props.rowKey);
      if (model.isSelected(id)) {
        return true;
      }
      return !model.exceeded;
    };

    /**
     *
     * 同步`fatTable`的选中状态
     *
     * 使其跟`Selection`保持一致
     *
     * @remarks
     *
     * 在数据量大的时候全选建议使用提供的`selectAll`方法进行处理
     *
     * 不要使用`element-ui` 自带的全选操作
     */
    const syncFatTableSelection = () => {
      const tableRef = fatTableRef.value!;
      tableRef.unselectAll();
      tableRef.select(
        ...tableRef.list.filter(item => {
          const id = toId(item, props.rowKey);
          return model.isSelected(id);
        })
      );
    };

    /**
     *
     * @param change 发生变化的对象
     */
    const handleSelect = (change: any) => {
      const id = toId(change, props.rowKey);
      model.toggle(id);
    };

    const handleSelectAll = (list: any[]) => {
      // length 为 0 代表取消全选
      if (list.length === 0) {
        const currentPageList = fatTableRef.value!.list;
        model.unselect(...toIds(currentPageList, props.rowKey));
      } else {
        model.select(...toIds(list, props.rowKey));
        // 在全选的情况 如果超出了限制 会出现表格状态跟 selectionModel 数据不同步的情况
        // 因此 我们需要手动同步一下状态
        if (model.exceeded) {
          syncFatTableSelection();
        }
      }
    };

    const handleLoad = async (list: any[]) => {
      const selectedNodes: any[] = [];
      list.forEach(item => {
        const id = toId(item, props.rowKey);
        itemStore.set(id, item);
        if (model.isSelected(id)) {
          selectedNodes.push(item);
        }
      });

      // 等待表格重新渲染完成
      await nextTick();

      fatTableRef.value!.select(...selectedNodes);
    };

    /**
     *---------------------------------------+
     *          以下是公开方法                |
     *---------------------------------------+
     */

    /**
     * 全选当前页数据
     *
     * 手动更改无法触发 el-table 的事件 因此手动处理
     */
    const selectAll = () => {
      const list = fatTableRef.value!.list;
      handleSelectAll(list);
    };

    const unselectAll = () => {
      handleSelectAll([]);
    };

    const select = (...items: any[]) => {
      model.select(...toIds(items, props.rowKey));
    };

    const unselect = (...items: any[]) => {
      model.unselect(...toIds(items, props.rowKey));
    };

    const toggle = (...items: any[]) => {
      model.toggle(
        ...toIds(items, props.rowKey).filter(id => {
          const item = itemStore.get(id);
          return !isDisabled.value(item);
        })
      );
    };

    const toggleAll = (...items: any[]) => {
      const list = fatTableRef.value!.list;
      toggle(list);
    };

    const clear = () => {
      model.clear();
    };

    const getSelected = () => {
      return model.selected.map(id => itemStore.get(id)!).map(transformValue);
    };

    const instance: FatTableSelectInstanceExposeMethods = {
      getSelected,
      clear,
      select,
      selectAll,
      unselect,
      unselectAll,
      toggle,
      toggleAll,
      removeSelected: () => {
        throw new FatTableSelectError('该模式下不支持删除');
      },
      remove: () => {
        throw new FatTableSelectError('该模式下不支持删除');
      },
    };

    forwardExpose(instance, FatTablePublicMethodKeys, fatTableRef);
    expose(instance);

    useDevtoolsExpose({
      model,
    });

    provide(FatTableInstanceContext, instance as any);

    const renderBottomToolbar = computed(() => {
      if (hasSlots(props, slots, 'bottomToolbar')) {
        return renderSlot(props, slots, 'bottomToolbar', instance, selectedList.value);
      }
      if (props.multiple) {
        return () => (
          <div class="fat-table-select__counter">
            已选<span class="fat-table-select__counter-value">{selectedCount.value}</span>条
          </div>
        );
      }

      return undefined;
    });

    return () => {
      const { multiple, rowKey, renderBottomToolbar: _renderBottomToolbar } = props;
      return (
        <FatTable
          class="fat-table-select"
          {...inheritProps()}
          {...IgnoreFatTableProps}
          renderBottomToolbar={renderBottomToolbar.value}
          columns={columns.value}
          enableSelect={multiple}
          selectable={selectable}
          ref={fatTableRef}
          onChange={Noop}
          onSelect={(_, change) => handleSelect(change)}
          onSelect-all={handleSelectAll}
          onLoad={handleLoad}
          rowKey={rowKey}
        ></FatTable>
      );
    };
  },
});

export const FatTableSelect = FatTableSelectInner as unknown as new <
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
>(
  props: FatTableProps<Item, Query>
) => OurComponentInstance<
  typeof props,
  FatTableSlots<Item, Query>,
  FatTableSelectEvents<Item, Query, Selection>,
  FatTableSelectMethods<Item, Query, Selection>
>;

export function useFatTableSelectRef<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
>() {
  return ref<FatTableSelectMethods<Item, Query, Selection>>();
}

export interface FatTableSelectGlobalConfigurations {
  /**
   *
   * 选择按钮的内容
   *
   * 默认为 `选择`
   * @remarks
   * 单选模式下 如果用户没有手动指定`actions`列的话 那么会自动添加一列`actions`列来进行处理选择操作
   *
   * 用户可以传入一个`string`或者是一个jsx对象来控制该列的显示内容
   */
  selectActionText?: any;
}
