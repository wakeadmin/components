import { declareComponent, declareProps } from '@wakeadmin/h';
import { TableColumnProps, TableColumn } from '@wakeadmin/component-adapter';
import { NoopObject, NoopArray } from '@wakeadmin/utils';

import { useAtomicRegistry } from '../hooks';

import { FatTableColumn, FatTableFilter, FatTableMethods, FatTableProps } from './types';
import { genKey, getAtom } from './utils';
import { FatTableActions, FatTableAction } from './table-actions';

export const Column = declareComponent({
  name: 'FatTableColumn',
  props: declareProps<{
    column: FatTableColumn<any>;
    index: number;
    selectable: FatTableProps<any, any>['selectable'];
    tableInstance: FatTableMethods<any>;
    filter: FatTableFilter;
  }>(['column', 'index', 'selectable', 'tableInstance', 'filter']),
  setup(props) {
    // 原件
    const atomics = useAtomicRegistry();

    return () => {
      const column = props.column;
      const index = props.index;
      const selectable = props.selectable;
      const tableInstance = props.tableInstance;
      const filter = props.filter;

      const type = column.type ?? 'default';
      const key = genKey(column, index);
      const valueProps = column.valueProps ?? NoopObject;
      const extraProps: TableColumnProps = {};

      let children: any;

      if (type === 'query') {
        return null;
      } else if (type === 'default' || type === 'expand') {
        children = {
          default: (scope: { row: any; $index: number }) => {
            // 自定义渲染
            const prop = column.prop;
            const row = scope.row;
            const idx = scope.$index;
            const value = typeof column.getter === 'function' ? column.getter(row, idx) : prop ? row[prop] : undefined;

            if (column.render) {
              return column.render(value, row, idx);
            } else {
              const { comp } = getAtom(column, atomics);

              return comp({
                mode: 'preview',
                value,
                ...valueProps,
              });
            }
          },
        };
      } else if (type === 'selection') {
        extraProps.selectable = selectable;
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

      if (column.filterable?.length) {
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
    };
  },
});
