import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';

import { FatFormDefineHelpers, FatFormChild, useFatFormDefineUtils } from '../fat-form';
import { forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import {
  FatFormPage,
  FatFormPagePublicMethodKeys,
  FatFormPageProps,
  FatFormPageMethods,
  useFatFormPageRef,
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
  helpers: {
    // modal 实例 引用
    form: Ref<FatFormPageMethods<Store> | undefined>;
  } & FatFormDefineHelpers<Store, Request, Submit>,
  props: FatFormPageDefineProps<Store, Request, Submit, Extra>
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
): (props: FatFormPageDefineProps<Store, Request, Submit, Extra>) => any {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormPage',
    setup(_, { slots, expose, attrs }) {
      const pageRef = useFatFormPageRef<Store>();
      const { item, group, section, consumer, renderChild, renderChildren } = useFatFormDefineUtils();

      const dsl = computed(
        define(
          {
            form: pageRef,
            item,
            group,
            section,
            consumer,
            renderChild,
            renderChildren,
          },
          attrs as any
        )
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
