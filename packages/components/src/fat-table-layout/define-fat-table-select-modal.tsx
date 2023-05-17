import { computed, Ref, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import { defineFatTableColumn, FatTableColumn } from '../fat-table';
import {
  FatTableSelectModal,
  FatTableSelectModalEvents,
  FatTableSelectModalMethods,
  FatTableSelectModalProps,
  FatTableSelectModalPublicMethodKeys,
  FatTableSelectModalSlots,
  useFatTableSelectModalRef,
} from './fat-table-select-modal';
import { FatTablePublicMethodKeys } from '../fat-table/constants';

export interface FatTableSelectModalDefinition<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends FatTableSelectModalProps<Item, Query, Selection>,
    CommonProps {}

export type FatTableSelectModalDefineProps<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string,
  Extra extends {} = {}
> = Partial<FatTableSelectModalProps<Item, Query, Selection> & { extra: Extra }>;

export type FatTableSelectModalDefine<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string,
  Extra extends {} = {}
> =
  | (FatTableSelectModalProps<Item, Query, Selection> & CommonProps)
  | ((context: {
      // modal 实例 引用
      modalRef: Ref<FatTableSelectModalMethods<Item, Query, Selection> | undefined>;
      props: FatTableSelectModalDefineProps<Item, Query, Selection, Extra>;
      emit: (key: string, ...args: any[]) => void;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
    }) => () => FatTableSelectModalDefinition<Item, Query, Selection>);

export function defineFatTableSelectModal<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string,
  Extra extends {} = {}
>(
  define: FatTableSelectModalDefine<Item, Query, Selection, Extra>
): DefineOurComponent<
  FatTableSelectModalDefineProps<Item, Query, Selection, Extra>,
  FatTableSelectModalSlots<Item, Query, Selection>,
  FatTableSelectModalEvents<Item, Query, Selection>,
  FatTableSelectModalMethods<Item, Query, Selection>
> {
  return declareComponent({
    name: 'PreDefineFatTableSelectModal',
    setup(_, { expose, attrs, emit, slots }) {
      const modalRef = useFatTableSelectModalRef();

      const extraDefinitions =
        typeof define === 'function'
          ? computed(define({ modalRef, column: defineFatTableColumn, props: attrs as any, emit }))
          : define;

      const instance = {};
      forwardExpose(instance, [...FatTableSelectModalPublicMethodKeys, ...FatTablePublicMethodKeys], modalRef);

      expose(instance as any);

      return () => {
        const preDefineProps = unref(extraDefinitions);
        return (
          <FatTableSelectModal
            ref={modalRef}
            {...(mergeProps(preDefineProps, inheritProps(false)) as any)}
            v-slots={pickEnumerable(slots)}
          ></FatTableSelectModal>
        );
      };
    },
  });
}
