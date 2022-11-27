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
  FatTableSelectModalSlots,
  useFatTableSelectModalRef,
} from './fat-table-select-modal';
import { FatTablePublicMethodKeys } from '../fat-table/constants';
import { FatTableSelectPublicMethodKeys } from './fat-table-select';

export interface FatTableSelectModalDefinition<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends FatTableSelectModalProps<Item, Query, Selection>,
    CommonProps {}

export type FatTableSelectModalDefineProps<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> = Partial<FatTableSelectModalProps<Item, Query, Selection>>;

export type FatTableSelectModalDefine<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> =
  | (FatTableSelectModalProps<Item, Query, Selection> & CommonProps)
  | ((context: {
      // modal 实例 引用
      modelRef: Ref<FatTableSelectModalMethods<Item, Query, Selection> | undefined>;
      props: FatTableSelectModalDefineProps<Item, Query, Selection>;
      emit: (key: string, ...args: any[]) => void;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
    }) => () => FatTableSelectModalDefinition<Item, Query, Selection>);

export function defineFatTableSelectModal<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
>(
  define: FatTableSelectModalDefine<Item, Query, Selection>
): DefineOurComponent<
  FatTableSelectModalDefineProps<Item, Query, Selection>,
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
          ? computed(define({ modelRef: modalRef, column: defineFatTableColumn, props: attrs as any, emit }))
          : define;

      const instance = {};
      forwardExpose(
        instance,
        [...FatTableSelectPublicMethodKeys, ...FatTablePublicMethodKeys, 'open', 'close'],
        modalRef
      );

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
