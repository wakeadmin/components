import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';

import { FatFormDefineHelpers, FatFormChild, useFatFormDefineUtils } from '../fat-form';
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import {
  FatFormPage,
  FatFormPagePublicMethodKeys,
  FatFormPageProps,
  FatFormPageMethods,
  useFatFormPageRef,
  FatFormPageSlots,
  FatFormPageEvents,
} from './fat-form-page';

export interface FatFormPageDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormPageProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

export type FatFormPageDefineProps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = Partial<FatFormPageProps<Store, Request, Submit> & { extra: Extra }>;

export type FatFormPageDefine<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = (
  context: {
    // modal 实例 引用
    form: Ref<FatFormPageMethods<Store> | undefined>;

    props: FatFormPageDefineProps<Store, Request, Submit, Extra>;
    emit: (key: string, ...args: any[]) => void;
  } & FatFormDefineHelpers<Store, Request, Submit>
) => () => FatFormPageDefinition<Store, Request, Submit>;

/**
 * 创建 fat-form-modal
 * @param define
 * @returns
 */
export function defineFatFormPage<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
>(
  define: FatFormPageDefine<Store, Request, Submit, Extra>,
  options?: { name?: string }
): DefineOurComponent<
  FatFormPageDefineProps<Store, Request, Submit, Extra>,
  FatFormPageSlots<Store>,
  FatFormPageEvents<Store, Submit>,
  FatFormPageMethods<Store>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormPage',
    setup(_, { slots, expose, attrs, emit }) {
      const pageRef = useFatFormPageRef<Store>();
      const { item, group, section, consumer, renderChild, renderChildren } = useFatFormDefineUtils();

      const dsl = computed(
        define({
          form: pageRef,
          item,
          group,
          section,
          consumer,
          renderChild,
          renderChildren,
          props: attrs as any,
          emit,
        })
      );

      // forward refs
      const instance = {};
      forwardExpose(instance, FatFormPagePublicMethodKeys, pageRef);
      expose(instance);

      return () => {
        const { children, ...fatFormModalProps } = unref(dsl);

        return (
          <FatFormPage
            ref={pageRef}
            {...mergeProps(fatFormModalProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default')}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatFormPage>
        );
      };
    },
  }) as any;
}
