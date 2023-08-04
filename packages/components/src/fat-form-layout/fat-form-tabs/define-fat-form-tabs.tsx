import { Ref, computed, unref } from '@wakeadmin/demi';
import { CommonProps } from '@wakeadmin/element-adapter';
import { declareComponent } from '@wakeadmin/h';

import {
  FatFormDefineHelpers,
  FatFormChild,
  useFatFormDefineUtils,
  FAT_FORM_CHILD_TYPE,
  CommonDefinitionProps,
  OmitType,
} from '../../fat-form';
import { DefineOurComponent, forwardExpose, identity, inheritProps, mergeProps, pickEnumerable } from '../../utils';

import { FatFormTabPane } from './fat-form-tab-pane';
import { FatFormTabs, useFatFormTabsRef, FatFormTabsPublicMethodKeys } from './fat-form-tabs';
import {
  FatFormTabPaneProps,
  FatFormTabsEvents,
  FatFormTabsMethods,
  FatFormTabsProps,
  FatFormTabsSlots,
} from './types';

export interface FatFormTabsDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormTabsProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

export type FatFormTabsDefineProps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = Partial<FatFormTabsProps<Store, Request, Submit> & { extra: Extra }>;

/**
 * fat-form-tab-pane 定义器类型
 */
export interface FatFormTabPaneDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends CommonDefinitionProps,
    FatFormTabPaneProps {
  [FAT_FORM_CHILD_TYPE]: 'tabPane';
  children?: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>;
}

/**
 * 在 fat-form helper 的基础上扩展 tabPane
 */
export interface FatFormTabsDefineHelpers<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormDefineHelpers<Store, Request, Submit> {
  tabPane: (
    g: OmitType<FatFormTabPaneDefinition<Store, Request, Submit>>
  ) => FatFormTabPaneDefinition<Store, Request, Submit>;
}

export type FatFormTabsDefine<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = (
  context: {
    // modal 实例 引用
    form: Ref<FatFormTabsMethods<Store> | undefined>;
    props: FatFormTabsDefineProps<Store, Request, Submit, Extra>;
    emit: (key: string, ...args: any[]) => void;
  } & FatFormTabsDefineHelpers<Store, Request, Submit>
) => () => FatFormTabsDefinition<Store, Request, Submit>;

const isTabPane = (value: any): value is FatFormTabPaneDefinition<any> => {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'tabPane';
};

/**
 * 创建 fat-form-tabs
 * @param define
 * @returns
 */
export function defineFatFormTabs<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
>(
  define: FatFormTabsDefine<Store, Request, Submit, Extra>,
  options?: { name?: string }
): DefineOurComponent<
  FatFormTabsDefineProps<Store, Request, Submit, Extra>,
  FatFormTabsSlots<Store>,
  FatFormTabsEvents<Store, Submit>,
  FatFormTabsMethods<Store>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormTabs',
    setup(_, { slots, expose, attrs, emit }) {
      const tabsRef = useFatFormTabsRef<Store>();
      const { item, group, section, consumer, table, tableColumn, renderChild, renderChildren } = useFatFormDefineUtils(
        // 扩展 tabPane 渲染器
        (child, render) => {
          if (isTabPane(child)) {
            const { children, ...other } = child;
            return <FatFormTabPane {...other}>{render(children)}</FatFormTabPane>;
          } else {
            return child;
          }
        }
      );

      const tabPane = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'tabPane', ...val } as any);

      const dsl = computed(
        define({
          form: tabsRef,
          item,
          group,
          section,
          tabPane,
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
      forwardExpose(instance, FatFormTabsPublicMethodKeys, tabsRef);
      expose(instance);

      return () => {
        const { children, ...fatFormStepsProps } = unref(dsl);

        return (
          <FatFormTabs
            ref={tabsRef}
            {...mergeProps(fatFormStepsProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default') as any}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatFormTabs>
        );
      };
    },
  }) as any;
}
