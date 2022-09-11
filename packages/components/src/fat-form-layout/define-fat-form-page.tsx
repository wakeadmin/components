import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/component-adapter';
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

export type FatFormPageDefine<Store extends {}, Request extends {} = Store, Submit extends {} = Store> = (
  helpers: {
    // modal 实例 引用
    form: Ref<FatFormPageMethods<Store> | undefined>;
  } & FatFormDefineHelpers<Store, Request, Submit>
) => () => FatFormPageDefinition<Store, Request, Submit>;

/**
 * 创建 fat-form-modal
 * @param define
 * @returns
 */
export function defineFatFormPage<Store extends {}, Request extends {} = Store, Submit extends {} = Store>(
  define: FatFormPageDefine<Store, Request, Submit>,
  options?: { name?: string }
): (props: Partial<FatFormPageProps<Store, Request, Submit>>) => any {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormPage',
    setup(_, { slots, expose }) {
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
