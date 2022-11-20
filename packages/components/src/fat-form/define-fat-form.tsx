import { CommonProps, KeyType } from '@wakeadmin/element-adapter';
import { computed, Ref, unref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { DefineOurComponent, forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';

import { FatForm } from './fat-form';
import { FatFormConsumer } from './fat-form-consumer';
import { FatFormGroup } from './fat-form-group';
import { FatFormItem } from './fat-form-item';
import { FatFormSection } from './fat-form-section';
import { useFatFormRef } from './hooks';

import {
  FatFormItemProps,
  FatFormGroupProps,
  FatFormSectionProps,
  FatFormMethods,
  FatFormProps,
  FatFormSlots,
  FatFormEvents,
} from './types';
import { FatFormPublicMethodKeys } from './constants';
import { FatFormTable, FatFormTableColumn, FatFormTableProps } from './fat-form-table';

export const FAT_FORM_CHILD_TYPE = Symbol('fat-form-child-type');

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
  ValueType extends keyof AtomicProps = 'text'
> extends FatFormItemProps<Store, Request, ValueType>,
    CommonDefinitionProps {
  [FAT_FORM_CHILD_TYPE]: 'item';
}

/**
 * fat-section 分节
 */
export interface FatFormSectionDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormSectionProps,
    CommonDefinitionProps {
  [FAT_FORM_CHILD_TYPE]: 'section';
  children?: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>;
}

/**
 * fat-form 分组
 */
export interface FatFormGroupDefinition<Store extends {}, Request extends {} = Store>
  extends FatFormGroupProps<Store>,
    CommonDefinitionProps {
  [FAT_FORM_CHILD_TYPE]: 'group';
  children?: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>;
}

export interface FatFormTableColumnDefinition<
  Store extends {},
  Request extends {} = Store,
  ValueType extends keyof AtomicProps = 'text'
> extends FatFormTableColumn<Store, Request, ValueType>,
    CommonDefinitionProps {
  [FAT_FORM_CHILD_TYPE]: 'tableColumn';
}

export interface FatFormTableDefinition<Store extends {}, Request extends {} = Store>
  extends Omit<FatFormTableProps<Store, Request>, 'columns'>,
    CommonDefinitionProps {
  [FAT_FORM_CHILD_TYPE]: 'table';
  // columns: FatFormTableColumnDefinition<Store, Request, any>[];
  columns: any[];
}

/**
 * fat-consumer
 */
export interface FatFormConsumerDefinition<Store extends {}, Request extends {} = Store> {
  [FAT_FORM_CHILD_TYPE]: 'consumer';
  render?: (form: FatFormMethods<Store>) => any | FatFormChild<Store, Request>[];
}

export interface FatFormDefinition<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormProps<Store, Request, Submit>,
    CommonDefinitionProps {
  children?: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>;
}

export type OmitType<T> = Omit<T, typeof FAT_FORM_CHILD_TYPE>;

export interface FatFormDefineHelpers<Store extends {}, Request extends {} = Store, Submit extends {} = Store> {
  /**
   * 分组, FatFormGroup
   */
  group: (g: OmitType<FatFormGroupDefinition<Store, Request>>) => FatFormGroupDefinition<Store, Request>;

  /**
   * 表单项, FatFormItem
   */
  item: <ValueType extends keyof AtomicProps = 'text'>(
    g: OmitType<FatFormItemDefinition<Store, Request, ValueType>>
  ) => FatFormItemDefinition<Store, Request, ValueType>;

  /**
   * 表格列表, FatFormTable
   */
  table: (g: OmitType<FatFormTableDefinition<Store, Request>>) => FatFormTableDefinition<Store, Request>;

  /**
   * 表格项, FatFormTable#columns
   */
  tableColumn: <ValueType extends keyof AtomicProps = 'text'>(
    g: OmitType<FatFormTableColumnDefinition<Store, Request, ValueType>>
  ) => FatFormTableColumnDefinition<Store, Request, ValueType>;

  /**
   * 分节, FatFormSection
   */
  section: (g: OmitType<FatFormSectionDefinition<Store, Request>>) => FatFormSectionDefinition<Store, Request>;

  /**
   *  联动, 如果要获取 form 对象，做一些联动, 推荐使用这个，而不是直接用 define 函数的 form.value, consumer 可以实现更精确的渲染
   */
  consumer: (render: (form: FatFormMethods<Store>) => any) => FatFormConsumerDefinition<Store>;

  // 以下是底层方法, 用于将定义渲染为 JSX 节点
  renderChild: (child: FatFormChild<Store, Request>) => any;
  renderChildren: (children: FatFormChild<Store, Request>[] | FatFormChild<Store, Request>) => any;
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
  context: {
    // 表单实例引用
    form: Ref<FatFormMethods<Store> | undefined>;
    props: FatFormDefineProps<Store, Request, Submit, Extra>;
    emit: (key: string, ...args: any[]) => void;
  } & FatFormDefineHelpers<Store, Request, Submit>
) => () => FatFormDefinition<Store, Request, Submit>;

function isItem(value: any): value is FatFormItemDefinition<any, any, any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'item';
}

function isSection(value: any): value is FatFormSectionDefinition<any, any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'section';
}

function isGroup(value: any): value is FatFormGroupDefinition<any, any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'group';
}

function isConsumer(value: any): value is FatFormConsumerDefinition<any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'consumer';
}

function isTable(value: any): value is FatFormTableDefinition<any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'table';
}

function isTableColumn(value: any): value is FatFormTableColumnDefinition<any> {
  return value != null && typeof value === 'object' && value[FAT_FORM_CHILD_TYPE] === 'tableColumn';
}

export function useFatFormDefineUtils(customRender?: (child: any, renderChildren: (children: any) => any) => any) {
  const item = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'item', ...val } as any);
  const group = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'group', ...val } as any);
  const table = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'table', ...val } as any);
  const tableColumn = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'tableColumn', ...val } as any);
  const section = (val: any) => ({ [FAT_FORM_CHILD_TYPE]: 'section', ...val } as any);
  const consumer = (render: any) =>
    ({
      [FAT_FORM_CHILD_TYPE]: 'consumer',
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
    } else if (isTable(child)) {
      const { columns } = child;
      if (!Array.isArray(columns) || columns.some(i => !isTableColumn(i))) {
        throw new Error(`table() 必须指定 columns 属性，且属性值必须是 tableColumn`);
      }

      return <FatFormTable {...child} />;
    } else if (customRender != null) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      return customRender(child, renderChildren);
    } else {
      return child;
    }
  };

  const renderChildren = (children: any) => {
    if (children == null) {
      return undefined;
    }

    if (!Array.isArray(children)) {
      return renderChild(children);
    }

    if (children.length === 0) {
      return undefined;
    }

    return children.map(renderChild);
  };

  return {
    item,
    group,
    section,
    consumer,
    table,
    tableColumn,
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
): DefineOurComponent<
  FatFormDefineProps<Store, Request, Submit, Extra>,
  FatFormSlots<Store>,
  FatFormEvents<Store, Submit>,
  FatFormMethods<Store, Request, Submit>
> {
  return declareComponent({
    name: options?.name ?? 'PreDefineFatForm',
    setup(_, { slots, expose, attrs, emit }) {
      const formRef = useFatFormRef<Store>();
      const { item, group, section, consumer, table, tableColumn, renderChild, renderChildren } =
        useFatFormDefineUtils();

      const dsl = computed(
        define({
          form: formRef,
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
        })
      );

      const instance = {};
      forwardExpose(instance, FatFormPublicMethodKeys, formRef);

      expose(instance);

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
