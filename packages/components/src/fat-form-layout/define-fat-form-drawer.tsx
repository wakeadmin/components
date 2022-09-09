import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/component-adapter';
import { declareComponent } from '@wakeadmin/h';

import { FatFormDefineHelpers, FatFormChild, useFatFormDefineUtils } from '../fat-form';
import { forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import {
  FatFormDrawer,
  FatFormDrawerProps,
  FatFormDrawerMethods,
  FatFormDrawerMethodKeys,
  useFatFormDrawerRef,
} from './fat-form-drawer';

export interface FatFormDrawerDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormDrawerProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

export type FatFormDrawerDefine<Store extends {}, Request extends {} = Store, Submit extends {} = Store> = (
  helpers: {
    // drawer 实例 引用
    form: Ref<FatFormDrawerMethods<Store> | undefined>;
  } & FatFormDefineHelpers<Store, Request, Submit>
) => () => FatFormDrawerDefinition<Store, Request, Submit>;

/**
 * 创建 fat-form-drawer
 * @param define
 * @returns
 */
export function defineFatFormDrawer<Store extends {}, Request extends {} = Store, Submit extends {} = Store>(
  define: FatFormDrawerDefine<Store, Request, Submit>
): (props: Partial<FatFormDrawerProps<Store, Request, Submit>>) => any {
  return declareComponent({
    name: 'PreDefineFatFormDrawer',
    setup(_, { slots, expose }) {
      const drawerRef = useFatFormDrawerRef<Store>();
      const { item, group, section, consumer, renderChildren } = useFatFormDefineUtils();

      const dsl = computed(
        define({
          form: drawerRef,
          item,
          group,
          section,
          consumer,
        })
      );

      // forward refs
      const instance = {};
      forwardExpose(instance, FatFormDrawerMethodKeys, drawerRef);
      expose(instance);

      return () => {
        const { children, ...fatFormDrawerProps } = unref(dsl);

        return (
          <FatFormDrawer
            ref={drawerRef}
            {...mergeProps(fatFormDrawerProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default')}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatFormDrawer>
        );
      };
    },
  }) as any;
}
