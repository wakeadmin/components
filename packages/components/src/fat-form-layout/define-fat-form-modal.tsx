import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';

import { FatFormDefineHelpers, FatFormChild, useFatFormDefineUtils } from '../fat-form';
import { DefineOurComponent, forwardExpose, identity, inheritProps, mergeProps, pickEnumerable } from '../utils';

import {
  FatFormModal,
  FatFormModalProps,
  FatFormModalMethods,
  FatFormModalMethodKeys,
  useFatFormModalRef,
  FatFormModalSlots,
  FatFormModalEvents,
} from './fat-form-modal';

export interface FatFormModalDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormModalProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

export type FatFormModalDefineProps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = Partial<FatFormModalProps<Store, Request, Submit> & { extra: Extra }>;

export type FatFormModalDefine<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = (
  context: {
    // modal 实例 引用
    form: Ref<FatFormModalMethods<Store> | undefined>;
    props: FatFormModalDefineProps<Store, Request, Submit, Extra>;
    emit: (key: string, ...args: any[]) => void;
  } & FatFormDefineHelpers<Store, Request, Submit>
) => () => FatFormModalDefinition<Store, Request, Submit>;

/**
 * 创建 fat-form-modal
 * @param define
 * @returns
 */
export function defineFatFormModal<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
>(
  define: FatFormModalDefine<Store, Request, Submit, Extra>,
  options?: { name?: string }
): DefineOurComponent<
  FatFormModalDefineProps<Store, Request, Submit, Extra>,
  FatFormModalSlots<Store>,
  FatFormModalEvents<Store, Submit>,
  FatFormModalMethods<Store>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormModal',
    setup(_, { slots, expose, attrs, emit }) {
      const modalRef = useFatFormModalRef<Store>();
      const { item, group, section, consumer, table, tableColumn, renderChild, renderChildren } =
        useFatFormDefineUtils();

      const dsl = computed(
        define({
          form: modalRef,
          item,
          group,
          section,
          consumer,
          table,
          tableColumn,
          renderChild,
          renderChildren,
          props: attrs as any,
          emit,
          p: identity as any,
        })
      );

      // forward refs
      const instance = {};
      forwardExpose(instance, FatFormModalMethodKeys, modalRef);
      expose(instance);

      return () => {
        const { children, ...fatFormModalProps } = unref(dsl);

        return (
          <FatFormModal
            ref={modalRef}
            {...mergeProps(fatFormModalProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default') as any}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatFormModal>
        );
      };
    },
  }) as any;
}
