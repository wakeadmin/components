import { CommonProps } from '@wakeadmin/component-adapter';
import { computed, Ref, unref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { Atomic } from '../atomic';

import { FatForm } from './fat-form';
import { FatFormConsumer } from './fat-form-consumer';
import { FatFormGroup } from './fat-form-group';
import { FatFormItem } from './fat-form-item';
import { FatFormSection } from './fat-form-section';
import { useFatFormRef } from './hooks';

import { FatFormItemProps, FatFormGroupProps, FatFormSectionProps, FatFormMethods, FatFormProps } from './types';

const TYPE = Symbol('fat-form-child-type');

export type FatFormChild<Store extends {}, Request extends {} = Store> = any;

/**
 * fat-item
 */
export interface FatFormItemDefinition<
  Store extends {},
  Request extends {} = Store,
  ValueType extends keyof AtomicProps | Atomic = 'text'
> extends FatFormItemProps<Store, ValueType, Request>,
    CommonProps {
  [TYPE]: 'item';
}

/**
 * fat-section 分节
 */
export interface FatFormSectionDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormSectionProps,
    CommonProps {
  [TYPE]: 'section';
  children?: FatFormChild<Store, Request>[];
}

/**
 * fat-form 分组
 */
export interface FatFormGroupDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormGroupProps<Store>,
    CommonProps {
  [TYPE]: 'group';
  children?: FatFormChild<Store, Request>[];
}

/**
 * fat-consumer
 */
export interface FatFormConsumerDefinition<Store extends {}> {
  [TYPE]: 'consumer';
  render?: (form: FatFormMethods<Store>) => any;
}

export interface FatFormDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormProps<Store, Request, Submit>,
    CommonProps {
  children?: FatFormChild<Store, Request>[];
}

type OmitType<T> = Omit<T, typeof TYPE>;

export type FatFormDefine<Store extends {}, Request extends {} = Store, Submit extends {} = Store> = (helpers: {
  // 表单实例引用
  form: Ref<FatFormMethods<Store> | undefined>;
  // 分组
  group: (g: OmitType<FatFormGroupDefinition<Store, Request>>) => FatFormGroupDefinition<Store, Request>;
  // 表单项
  item: <ValueType extends keyof AtomicProps | Atomic = 'text'>(
    g: OmitType<FatFormItemDefinition<Store, Request, ValueType>>
  ) => FatFormItemDefinition<Store, Request, ValueType>;
  // 分节
  section: (g: OmitType<FatFormSectionDefinition<Store, Request>>) => FatFormSectionDefinition<Store, Request>;
  // 联动
  consumer: (render: (form: FatFormMethods<Store>) => any) => FatFormConsumerDefinition<Store>;
}) => () => FatFormDefinition<Store, Request, Submit>;

function isItem(value: any): value is FatFormItemDefinition<any, any, any> {
  return value != null && typeof value === 'object' && value[TYPE] === 'item';
}

function isSection(value: any): value is FatFormSectionDefinition<any, any> {
  return value != null && typeof value === 'object' && value[TYPE] === 'section';
}

function isGroup(value: any): value is FatFormGroupDefinition<any, any> {
  return value != null && typeof value === 'object' && value[TYPE] === 'group';
}

function isConsumer(value: any): value is FatFormConsumerDefinition<any> {
  return value != null && typeof value === 'object' && value[TYPE] === 'consumer';
}

export function defineFatForm<Store extends {}, Request extends {} = Store, Submit extends {} = Store>(
  define: FatFormDefine<Store, Request, Submit>
): (props: Partial<FatFormProps<Store, Request, Submit>>) => any {
  return declareComponent({
    name: 'PreDefineFatForm',
    setup(props, { slots }) {
      const formRef = useFatFormRef<Store>();
      const item = (val: any) => ({ [TYPE]: 'item', ...val } as any);
      const group = (val: any) => ({ [TYPE]: 'group', ...val } as any);
      const section = (val: any) => ({ [TYPE]: 'section', ...val } as any);
      const consumer = (render: any) => ({ [TYPE]: 'consumer', render } as any);

      const dsl = computed(
        define({
          form: formRef,
          item,
          group,
          section,
          consumer,
        })
      );

      const renderChildren = (children: any) => {
        if (children == null || children.length === 0) {
          return undefined;
        }

        return children.map((child: any) => {
          if (isItem(child)) {
            return <FatFormItem {...child} />;
          } else if (isGroup(child)) {
            const { children: groupChildren, ...other } = child;
            return <FatFormGroup {...other}>{renderChildren(groupChildren)}</FatFormGroup>;
          } else if (isSection(child)) {
            const { children: sectionChildren, ...other } = child;
            return <FatFormSection {...other}>{renderChildren(sectionChildren)}</FatFormSection>;
          } else if (isConsumer(child)) {
            return <FatFormConsumer renderDefault={child.render} />;
          } else {
            return child;
          }
        });
      };

      return () => {
        const { children, ...fatFormProps } = unref(dsl);

        return (
          <FatForm ref={formRef} {...fatFormProps} {...props}>
            {renderChildren(children)}
            {slots.default?.()}
          </FatForm>
        );
      };
    },
  }) as any;
}
