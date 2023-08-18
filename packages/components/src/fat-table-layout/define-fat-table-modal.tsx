import { computed, Ref, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';
import { DefineOurComponent, forwardExpose, identity, inheritProps, mergeProps, pickEnumerable } from '../utils';

import { defineFatTableColumn, FatTableColumn } from '../fat-table';
import {
  FatTableModal,
  FatTableModalEvents,
  FatTableModalMethods,
  FatTableModalProps,
  FatTableModalPublicMethodKeys,
  FatTableModalSlots,
  useFatTableModalRef,
} from './fat-table-modal';
import { FatTablePublicMethodKeys } from '../fat-table/constants';

export interface FatTableModalDefinition<Item extends {}, Query extends {}>
  extends FatTableModalProps<Item, Query>,
    CommonProps {}

export type FatTableModalDefineProps<Item extends {}, Query extends {}, Extra extends {} = {}> = Partial<
  FatTableModalProps<Item, Query> & { extra: Extra }
>;

export type FatTableModalDefine<Item extends {}, Query extends {}, Extra extends {} = {}> =
  | (FatTableModalProps<Item, Query> & CommonProps)
  | ((context: {
      // modal 实例 引用
      modelRef: Ref<FatTableModalMethods<Item, Query> | undefined>;
      props: FatTableModalDefineProps<Item, Query, Extra>;
      emit: (key: string, ...args: any[]) => void;
      p: (key: keyof Item) => string;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<Item, Query, ValueType>) => any;
    }) => () => FatTableModalDefinition<Item, Query>);

export function defineFatTableModal<Item extends {}, Query extends {}, Extra extends {} = {}>(
  define: FatTableModalDefine<Item, Query, Extra>
): DefineOurComponent<
  FatTableModalDefineProps<Item, Query, Extra>,
  FatTableModalSlots<Item, Query>,
  FatTableModalEvents<Item, Query>,
  FatTableModalMethods<Item, Query>
> {
  return declareComponent({
    name: 'PreDefineFatTableModal',
    setup(_, { expose, attrs, emit, slots }) {
      const modalRef = useFatTableModalRef();

      const extraDefinitions =
        typeof define === 'function'
          ? computed(
              define({
                modelRef: modalRef,
                column: defineFatTableColumn,
                props: attrs as any,
                emit,
                p: identity as any,
              })
            )
          : define;

      const instance = {};
      forwardExpose(instance, [...FatTablePublicMethodKeys, ...FatTableModalPublicMethodKeys], modalRef);

      expose(instance as any);

      return () => {
        const preDefineProps = unref(extraDefinitions);
        return (
          <FatTableModal
            ref={modalRef}
            {...(mergeProps(preDefineProps, inheritProps(false)) as any)}
            v-slots={pickEnumerable(slots)}
          ></FatTableModal>
        );
      };
    },
  });
}
