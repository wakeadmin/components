import { CommonProps, KeyType } from '@wakeadmin/element-adapter';
import { computed, Ref, unref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { Atomic } from '../atomic';
import { inheritProps, mergeProps, pickEnumerable } from '../utils';

import { FatForm } from './fat-form';
import { FatFormConsumer } from './fat-form-consumer';
import { FatFormGroup } from './fat-form-group';
import { FatFormItem } from './fat-form-item';
import { FatFormSection } from './fat-form-section';
import { useFatFormRef } from './hooks';

import { FatFormItemProps, FatFormGroupProps, FatFormSectionProps, FatFormMethods, FatFormProps } from './types';

const TYPE = Symbol('fat-form-child-type');

export type FatFormChild<Store extends {}, Request extends {} = Store> = any;

export interface CommonDefinitionProps extends CommonProps {
  key?: KeyType;
}

/**
 * fat-item
 */
export interface FatFormItemDefinition<
  Store extends {},
  Request extends {} = Store,
  ValueType extends keyof AtomicProps | Atomic = 'text'
> extends FatFormItemProps<Store, ValueType, Request>,
    CommonDefinitionProps {
  [TYPE]: 'item';
}

/**
 * fat-section 分节
 */
export interface FatFormSectionDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormSectionProps,
    CommonDefinitionProps {
  [TYPE]: 'section';
  children?: FatFormChild<Store, Request>[];
}

/**
 * fat-form 分组
 */
export interface FatFormGroupDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormGroupProps<Store>,
    CommonDefinitionProps {
  [TYPE]: 'group';
  children?: FatFormChild<Store, Request>[];
}

/**
 * fat-consumer
 */
export interface FatFormConsumerDefinition<Store extends {}, Request extends {} = Store> {
  [TYPE]: 'consumer';
  render?: (form: FatFormMethods<Store>) => any | FatFormChild<Store, Request>[];
}

export interface FatFormDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormProps<Store, Request, Submit>,
    CommonDefinitionProps {
  children?: FatFormChild<Store, Request>[];
}

type OmitType<T> = Omit<T, typeof TYPE>;

export interface FatFormDefineHelpers<Store extends {}, Request extends {} = Store, Submit extends {} = Store> {
  /**
   * 分组
   */
  group: (g: OmitType<FatFormGroupDefinition<Store, Request>>) => FatFormGroupDefinition<Store, Request>;

  /**
   * 表单项
   */
  item: <ValueType extends keyof AtomicProps | Atomic = 'text'>(
    g: OmitType<FatFormItemDefinition<Store, Request, ValueType>>
  ) => FatFormItemDefinition<Store, Request, ValueType>;

  /**
   * 分节
   */
  section: (g: OmitType<FatFormSectionDefinition<Store, Request>>) => FatFormSectionDefinition<Store, Request>;

  /**
   *  联动, 如果要获取 form 对象，做一些联动, 推荐使用这个，而不是直接用 define 函数的 form.value, consumer 可以实现更精确的渲染
   */
  consumer: (render: (form: FatFormMethods<Store>) => any) => FatFormConsumerDefinition<Store>;

  // 以下是底层方法, 用于将定义渲染为 JSX 节点
  renderChild: (child: FatFormChild<Store, Request>) => any;
  renderChildren: (children: FatFormChild<Store, Request>[]) => any;
}

export type FatFormDefineProps<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = Partial<FatFormProps<Store, Request, Submit> & { extra: Extra }>;

export type FatFormDefine<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
> = (
  helpers: {
    // 表单实例引用
    form: Ref<FatFormMethods<Store> | undefined>;
  } & FatFormDefineHelpers<Store, Request, Submit>,
  props: FatFormDefineProps<Store, Request, Submit, Extra>
) => () => FatFormDefinition<Store, Request, Submit>;

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

export function useFatFormDefineUtils() {
  const item = (val: any) => ({ [TYPE]: 'item', ...val } as any);
  const group = (val: any) => ({ [TYPE]: 'group', ...val } as any);
  const section = (val: any) => ({ [TYPE]: 'section', ...val } as any);
  const consumer = (render: any) =>
    ({
      [TYPE]: 'consumer',
      render: (form: FatFormMethods<any>) => {
        const rtn = render(form);

        if (rtn == null) {
          return rtn;
        }

        // FIXME: vue2 下不支持 fragment
        if (Array.isArray(rtn)) {
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          return renderChildren(rtn);
        }

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return renderChild(rtn);
      },
    } as any);

  const renderChild = (child: any) => {
    if (isItem(child)) {
      return <FatFormItem {...child} />;
    } else if (isGroup(child)) {
      const { children: groupChildren, ...other } = child;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return <FatFormGroup {...other}>{renderChildren(groupChildren)}</FatFormGroup>;
    } else if (isSection(child)) {
      const { children: sectionChildren, ...other } = child;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return <FatFormSection {...other}>{renderChildren(sectionChildren)}</FatFormSection>;
    } else if (isConsumer(child)) {
      return <FatFormConsumer renderDefault={child.render} />;
    } else {
      return child;
    }
  };

  const renderChildren = (children: any) => {
    if (children == null || children.length === 0) {
      return undefined;
    }

    return children.map(renderChild);
  };

  return {
    item,
    group,
    section,
    consumer,
    renderChild,
    renderChildren,
  };
}

export function defineFatForm<
  Store extends {},
  Request extends {} = Store,
  Submit extends {} = Store,
  Extra extends {} = {}
>(
  define: FatFormDefine<Store, Request, Submit, Extra>,
  options?: { name: string }
): (props: FatFormDefineProps<Store, Request, Submit, Extra>) => any {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatForm',
    setup(_, { slots, expose, attrs }) {
      const formRef = useFatFormRef<Store>();
      const { item, group, section, consumer, renderChild, renderChildren } = useFatFormDefineUtils();

      const dsl = computed(
        define(
          {
            form: formRef,
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

      expose({
        get form() {
          return formRef.value;
        },
      });

      return () => {
        const { children, ...fatFormProps } = unref(dsl);

        return (
          <FatForm
            ref={formRef}
            {...mergeProps(fatFormProps, inheritProps(false))}
            v-slots={pickEnumerable(slots, 'default')}
          >
            {renderChildren(children)}
            {slots.default?.()}
          </FatForm>
        );
      };
    },
  }) as any;
}
