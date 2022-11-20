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
import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../../utils';
import { FatFormStep, FatFormStepProps } from './fat-form-step';
import { FatFormStepsPublicMethodKeys, useFatFormStepsRef, FatFormSteps } from './fat-form-steps';

import { FatFormStepsEvents, FatFormStepsMethods, FatFormStepsProps, FatFormStepsSlots } from './types';

export interface FatFormStepsDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormStepsProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

export type FatFormStepsDefineProps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = Partial<FatFormStepsProps<Store, Request, Submit> & { extra: Extra }>;

/**
 * fat-form-step 定义器类型
 */
export interface FatFormStepDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends CommonDefinitionProps,
    FatFormStepProps<Store, Request, Submit> {
  [FAT_FORM_CHILD_TYPE]: 'step';
  children?: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>;
}

/**
 * 在 fat-form helper 的基础上扩展 step
 */
export interface FatFormStepsDefineHelpers<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormDefineHelpers<Store, Request, Submit> {
  step: (g: OmitType<FatFormStepDefinition<Store, Request, Submit>>) => FatFormStepDefinition<Store, Request, Submit>;
}

export type FatFormStepsDefine<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = (
  context: {
    // modal 实例 引用
    form: Ref<FatFormStepsMethods<Store> | undefined>;
    props: FatFormStepsDefineProps<Store, Request, Submit, Extra>;
    emit: (key: string, ...args: any[]) => void;
  } & FatFormStepsDefineHelpers<Store, Request, Submit>
) => () => FatFormStepsDefinition<Store, Request, Submit>;

const isStep = (value: any): value is FatFormStepDefinition<any> => {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'step';
};

/**
 * 创建 fat-form-steps
 * @param define
 * @returns
 */
export function defineFatFormSteps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
>(
  define: FatFormStepsDefine<Store, Request, Submit, Extra>,
  options?: { name?: string }
): DefineOurComponent<
  FatFormStepsDefineProps<Store, Request, Submit, Extra>,
  FatFormStepsSlots<Store>,
  FatFormStepsEvents<Store, Submit>,
  FatFormStepsMethods<Store>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatFormSteps',
    setup(_, { slots, expose, attrs, emit }) {
      const stepsRef = useFatFormStepsRef<Store>();
      const { item, group, section, consumer, table, tableColumn, renderChild, renderChildren } = useFatFormDefineUtils(
        // 扩展 step 渲染器
        (child, render) => {
          if (isStep(child)) {
            const { children, ...other } = child;
            return <FatFormStep {...other}>{render(children)}</FatFormStep>;
          } else {
            return child;
          }
        }
      );

      const step = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'step', ...val } as any);

      const dsl = computed(
        define({
          form: stepsRef,
          item,
          group,
          section,
          step,
          consumer,
          table,
          tableColumn,
          renderChild,
          renderChildren,
          props: attrs as any,
          emit,
        })
      );

      // forward refs
      const instance = {};
      forwardExpose(instance, FatFormStepsPublicMethodKeys, stepsRef);
      expose(instance);

      return () => {
        const { children, ...fatFormStepsProps } = unref(dsl);

        return (
          <FatFormSteps
            ref={stepsRef}
            {...mergeProps(fatFormStepsProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default') as any}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatFormSteps>
        );
      };
    },
  }) as any;
}
