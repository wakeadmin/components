import { computed, Ref, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import { defineFatTableColumn, FatTableColumn } from '../fat-table';
import {
  FatTableDrawer,
  FatTableDrawerEvents,
  FatTableDrawerMethods,
  FatTableDrawerProps,
  FatTableDrawerSlots,
  useFatTableDrawerRef,
} from './fat-table-drawer';
import { FatTablePublicMethodKeys } from '../fat-table/constants';

export interface FatTableDrawerDefinition<Item extends {}, Query extends {}>
  extends FatTableDrawerProps<Item, Query>,
    CommonProps {}

export type FatTableDrawerDefineProps<Item extends {}, Query extends {}> = Partial<FatTableDrawerProps<Item, Query>>;

export type FatTableDrawerDefine<Item extends {}, Query extends {}> =
  | (FatTableDrawerProps<Item, Query> & CommonProps)
  | ((context: {
      // modal 实例 引用
      modelRef: Ref<FatTableDrawerMethods<Item, Query> | undefined>;
      props: FatTableDrawerDefineProps<Item, Query>;
      emit: (key: string, ...args: any[]) => void;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
    }) => () => FatTableDrawerDefinition<Item, Query>);

export function defineFatTableDrawer<Item extends {}, Query extends {}>(
  define: FatTableDrawerDefine<Item, Query>
): DefineOurComponent<
  FatTableDrawerDefineProps<Item, Query>,
  FatTableDrawerSlots<Item, Query>,
  FatTableDrawerEvents<Item, Query>,
  FatTableDrawerMethods<Item, Query>
> {
  return declareComponent({
    name: 'PreDefineFatTableDrawer',
    setup(_, { expose, attrs, emit, slots }) {
      const modalRef = useFatTableDrawerRef();

      const extraDefinitions =
        typeof define === 'function'
          ? computed(define({ modelRef: modalRef, column: defineFatTableColumn, props: attrs as any, emit }))
          : define;

      const instance = {};
      forwardExpose(instance, [...FatTablePublicMethodKeys, 'open', 'close'], modalRef);

      expose(instance as any);

      return () => {
        const preDefineProps = unref(extraDefinitions);
        return (
          <FatTableDrawer
            ref={modalRef}
            {...(mergeProps(preDefineProps, inheritProps(false)) as any)}
            v-slots={pickEnumerable(slots)}
          ></FatTableDrawer>
        );
      };
    },
  });
}
