import { computed, Ref, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import { defineFatTableColumn, FatTableColumn, FatTableSlots } from '../fat-table';
import { FatTablePublicMethodKeys } from '../fat-table/constants';
import {
  FatTableSelect,
  FatTableSelectEvents,
  FatTableSelectMethods,
  FatTableSelectProps,
  FatTableSelectPublicMethodKeys,
  useFatTableSelectRef,
} from './fat-table-select';

export interface FatTableSelectDefinition<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
> extends FatTableSelectProps<Item, Query, Selection>,
    CommonProps {}

export type FatTableSelectDefineProps<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any,
  Extra extends {} = {}
> = Partial<FatTableSelectProps<Item, Query, Selection> & { extra: Extra }>;

export type FatTableSelectDefine<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any,
  Extra extends {} = {}
> =
  | (FatTableSelectProps<Item, Query, Selection> & CommonProps)
  | ((context: {
      tableRef: Ref<FatTableSelectMethods<Item, Query, Selection> | undefined>;
      props: FatTableSelectDefineProps<Item, Query, Selection, Extra>;
      emit: (key: string, ...args: any[]) => void;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
    }) => () => FatTableSelectDefinition<Item, Query, Selection>);

export function defineFatTableSelect<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any,
  Extra extends {} = {}
>(
  define: FatTableSelectDefine<Item, Query, Selection, Extra>
): DefineOurComponent<
  FatTableSelectDefineProps<Item, Query, Selection, Extra>,
  FatTableSlots<Item, Query>,
  FatTableSelectEvents<Item, Query, Selection>,
  FatTableSelectMethods<Item, Query, Selection>
> {
  return declareComponent({
    name: 'PreDefineFatTableSelect',
    setup(_, { expose, attrs, emit, slots }) {
      const tableRef = useFatTableSelectRef();

      const extraDefinitions =
        typeof define === 'function'
          ? computed(define({ tableRef, column: defineFatTableColumn, props: attrs as any, emit }))
          : define;

      const instance = {};
      forwardExpose(instance, FatTablePublicMethodKeys, tableRef);
      forwardExpose(instance, FatTableSelectPublicMethodKeys, tableRef);

      expose(instance as any);

      return () => {
        const preDefineProps = unref(extraDefinitions);
        return (
          <FatTableSelect
            ref={tableRef}
            {...(mergeProps(preDefineProps, inheritProps(false)) as any)}
            v-slots={pickEnumerable(slots)}
          ></FatTableSelect>
        );
      };
    },
  });
}
