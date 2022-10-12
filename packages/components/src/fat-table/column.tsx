import { declareComponent, declareProps } from '@wakeadmin/h';
import { TableColumnProps, TableColumn, Tooltip } from '@wakeadmin/element-adapter';
import { NoopObject, NoopArray, get } from '@wakeadmin/utils';
import { computed } from '@wakeadmin/demi';
import { Inquiry } from '@wakeadmin/icons';

import { useAtomicRegistry } from '../hooks';
import { composeAtomProps, setByPath, normalizeClassName } from '../utils';
import { FatActions, FatAction } from '../fat-actions';
import { BaseAtomicContext } from '../atomic';

import { FatTableColumn, FatTableFilter, FatTableMethods } from './types';
import { genKey, getAtom } from './utils';

const BUILTIN_TYPES = new Set(['index', 'selection', 'expand']);

const normalizeType = (t: string) => (BUILTIN_TYPES.has(t) ? t : undefined);

const Actions = declareComponent({
  name: 'FatTableActions',
  props: declareProps<{
    tableInstance: FatTableMethods<any, any>;
    column: FatTableColumn<any>;
    row: any;
    index: number;
  }>(['tableInstance', 'column', 'row', 'index']),
  setup(props) {
    const actions = computed(() => {
      const { column, tableInstance, row, index } = props;
      return (
        (typeof column.actions === 'function' ? column.actions(tableInstance, row, index) : column.actions) ?? NoopArray
      );
    });

    const derivedActions = computed(() => {
      const { tableInstance, row, index } = props;
      return actions.value.map(action => {
        return {
          ...action,
          disabled:
            typeof action.disabled === 'function'
              ? action.disabled(tableInstance, row, action, index)
              : action.disabled,
          title: typeof action.title === 'function' ? action.title(tableInstance, row, action, index) : action.title,
          visible:
            typeof action.visible === 'function' ? action.visible(tableInstance, row, action, index) : action.visible,
          onClick: () => {
            return action.onClick?.(tableInstance, row, action, index);
          },
          confirm:
            typeof action.confirm === 'function'
              ? action.confirm.bind(action, { table: tableInstance, row, index, action })
              : action.confirm,
        } as FatAction;
      });
    });

    return () => {
      const { column } = props;

      return (
        <FatActions
          options={derivedActions.value}
          max={column.actionsMax}
          class={normalizeClassName(column.actionsClassName, `fat-actions--${column.align ?? 'left'}`)}
          style={column.actionsStyle}
          type={column.actionsType}
          size={column.actionsSize}
        />
      );
    };
  },
});

const Cell = declareComponent({
  name: 'FatTableCell',
  props: declareProps<{ column: FatTableColumn<any>; row: any; index: number }>(['column', 'row', 'index']),
  setup(props) {
    const atomics = useAtomicRegistry();
    const value = computed(() => {
      const { column, row, index } = props;
      const prop = column.prop;

      return typeof column.getter === 'function' ? column.getter(row, index) : prop ? get(row, prop) : undefined;
    });

    const handleChange = (val: any) => {
      const column = props.column;
      // 只有设置 prop 才生效
      if (column.prop && props.row != null) {
        setByPath(props.row, column.prop, val);
      }
    };

    const atom = computed(() => {
      return getAtom(props.column, atomics);
    });

    const valueProps = computed(() => {
      const column = props.column;

      return (
        (typeof column.valueProps === 'function' ? column.valueProps(props.row, props.index) : column.valueProps) ??
        NoopObject
      );
    });

    const atomProps = computed(() => {
      const { column, row } = props;
      return composeAtomProps(
        {
          mode: 'preview',
          scene: 'table',
          class: column.valueClassName,
          style: column.valueStyle,
          context: {
            label: column.label,
            prop: column.prop,
            values: row,
          } as BaseAtomicContext,
          // readonly
          value: value.value,
          onChange: handleChange,
        },
        valueProps.value
      );
    });

    return () => {
      const { column, row, index } = props;

      if (column.render) {
        return column.render(value.value, row, index);
      } else {
        // 原件
        const { comp } = atom.value;

        return comp(atomProps.value);
      }
    };
  },
});

export const Column = declareComponent({
  name: 'FatTableColumn',
  props: declareProps<{
    column: FatTableColumn<any>;
    index: number;
    tableInstance: FatTableMethods<any, any>;
    filter: FatTableFilter;
  }>(['column', 'index', 'tableInstance', 'filter']),
  setup(props) {
    return () => {
      const column = props.column;
      const index = props.index;
      const tableInstance = props.tableInstance;
      const filter = props.filter;

      const type = column.type ?? 'default';
      const key = genKey(column, index);
      const extraProps: TableColumnProps = {};

      let children: any;

      if (type === 'query') {
        return null;
      } else if (type === 'default' || type === 'expand') {
        children = {
          default: (scope: { row: any; $index: number }) => {
            // 自定义渲染
            const row = scope.row;
            const idx = scope.$index;

            return <Cell row={row} index={idx} column={column} />;
          },
        };
      } else if (type === 'selection') {
        extraProps.selectable = column.selectable;
      } else if (type === 'actions') {
        // 操作
        children = {
          default: (scope: { row: any; $index: number }) => {
            return <Actions row={scope.row} index={scope.$index} tableInstance={tableInstance} column={column} />;
          },
        };
      } else if (type === 'index') {
        extraProps.index = column.index;
      }

      if (column.filterable?.length) {
        extraProps.filters = column.filterable;
        extraProps.filteredValue = filter[column.prop as string] ?? [];
        extraProps.filterMultiple = column.filterMultiple;
        extraProps.columnKey = column.prop;
      }

      return (
        <TableColumn
          type={normalizeType(type)}
          key={key}
          prop={column.prop as string}
          label={column.label}
          renderHeader={
            column.renderLabel?.bind(null, index, column) ??
            (column.tooltip
              ? () => {
                  return (
                    <span>
                      {column.label}
                      <Tooltip v-slots={{ content: column.tooltip }}>
                        <Inquiry class="fat-table__tooltip" />
                      </Tooltip>
                    </span>
                  );
                }
              : undefined)
          }
          // 样式
          className={column.className}
          labelClassName={column.labelClassName}
          width={column.width}
          minWidth={column.minWidth}
          align={column.align}
          headerAlign={column.labelAlign}
          fixed={column.fixed}
          showOverflowTooltip={column.showOverflowTooltip}
          sortable={column.sortable ? 'custom' : undefined}
          resizable={column.resizable}
          {...extraProps}
        >
          {children}
        </TableColumn>
      );
    };
  },
});
