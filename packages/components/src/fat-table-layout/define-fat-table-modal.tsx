import { computed, Ref, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps } from '../utils';

import { defineFatTableColumn, FatTableColumn } from '../fat-table';
import {
  FatTableModal,
  FatTableModalEvents,
  FatTableModalMethods,
  FatTableModalProps,
  FatTableModalSlots,
  useFatTableModalRef,
} from './fat-table-modal';
import { FatTablePublicMethodKeys } from '../fat-table/constants';

export interface FatTableModalDefinition<T extends {}, S extends {}> extends FatTableModalProps<T, S>, CommonProps {}

export type FatTableModalDefineProps<T extends {}, S extends {}> = Partial<FatTableModalProps<T, S>>;

export type FatTableModalDefine<T extends {}, S extends {}> =
  | (FatTableModalProps<T, S> & CommonProps)
  | ((context: {
      // modal 实例 引用
      modelRef: Ref<FatTableModalMethods<T, S> | undefined>;
      props: FatTableModalDefineProps<T, S>;
      emit: (key: string, ...args: any[]) => void;
      column: <ValueType extends keyof AtomicProps = 'text'>(column: FatTableColumn<T, S, ValueType>) => any;
    }) => () => FatTableModalDefinition<T, S>);

export function defineFatTableModal<T extends {}, S extends {}>(
  define: FatTableModalDefine<T, S>
): DefineOurComponent<
  FatTableModalDefineProps<T, S>,
  FatTableModalSlots<T, S>,
  FatTableModalEvents<T, S>,
  FatTableModalMethods<T, S>
> {
  return declareComponent({
    name: 'PreDefineFatTableModal',
    setup(_, { expose, attrs, emit }) {
      const modalRef = useFatTableModalRef();

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
          <FatTableModal ref={modalRef} {...(mergeProps(preDefineProps, inheritProps(false)) as any)}></FatTableModal>
        );
      };
    },
  });
}
