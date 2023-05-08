import { StepProps, Step } from '@wakeadmin/element-adapter';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { onBeforeUnmount, ref, shallowReactive } from '@wakeadmin/demi';

import { FatFormStepMethods, useFatFormStepsContext } from './fat-form-steps-context';
import { FatFormCollectionItem, FatFormCollection, FatFormCollectionProvider } from '../../fat-form';
import { hasChild, hasSlots, normalizeClassName, OurComponentInstance, renderSlot } from '../../utils';

export interface FatFormStepSlots {
  /**
   * 自定义图标
   */
  renderIcon?: () => any;

  /**
   * 自定义标题
   */
  renderTitle?: () => any;

  /**
   * 自定义描述
   */
  renderDescription?: () => any;

  /**
   * 表单主体
   */
  renderDefault?: () => any;
}

export interface FatFormStepEvents {}

export interface FatFormStepProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends StepProps,
    FatFormStepSlots,
    FatFormStepEvents {
  /**
   * 步骤提交。在点击下一步或者提交(最后异步)时触发, 可以在这里进行一些数据验证之类的操作，如果抛出异常则终止运行。
   * TODO: 最后一步没有触发
   */
  beforeSubmit?: (value: Store) => Promise<void>;
}

const FatFormStepInner = declareComponent({
  name: 'FatFormStep',
  props: declareProps<FatFormStepProps>({
    beforeSubmit: null,

    // slots
    renderIcon: null,
    renderTitle: null,
    renderDescription: null,
    renderDefault: null,

    // step
    title: null,
    description: null,
    icon: null,
    status: null,
  }),
  setup(props, { slots, attrs }) {
    const parent = useFatFormStepsContext();
    // 收集到的所有表单项
    const items: FatFormCollectionItem[] = [];
    const sections = ref<any[]>([]);

    const collection: FatFormCollection = {
      registerSection(item) {
        sections.value.push(item);

        return () => {
          const idx = sections.value.indexOf(item);
          if (idx !== -1) {
            sections.value.splice(idx, 1);
          }
        };
      },
      registerItem(item) {
        items.push(item);

        return () => {
          const idx = items.indexOf(item);
          if (idx !== -1) {
            items.splice(idx, 1);
          }
        };
      },
    };

    const renderSlotIfNeeded = (name: 'icon' | 'title' | 'description') => {
      return hasSlots(props, slots, name) ? renderSlot(props, slots, name) : undefined;
    };

    const instance: FatFormStepMethods = shallowReactive({
      async validate() {
        // 让管辖内的表单项进行验证
        await Promise.all(items.map(i => i.validate()));
      },
      async beforeSubmit(value: any) {
        await props.beforeSubmit?.(value);
      },
      renderStepResult: undefined,
      renderFormResult: undefined,
    });

    const state = parent?.register(instance);
    if (state == null) {
      throw new Error(`fat-form-step 必须作为 fat-form-steps 的子孙节点使用`);
    }

    const { disposer, active, handleClick } = state!;

    // 释放
    if (disposer) {
      onBeforeUnmount(disposer);
    }

    return () => {
      const { title, description, icon, status } = props;

      instance.renderStepResult = (
        <Step
          {...{ title, description, icon, status }}
          class={normalizeClassName('fat-form-steps__step', {
            'fat-form-steps__step--active': active.value,
          })}
          // @ts-expect-error 原始属性挂载
          onClickNative={handleClick}
          v-slots={{
            icon: renderSlotIfNeeded('icon'),
            title: renderSlotIfNeeded('title'),
            description: renderSlotIfNeeded('description'),
          }}
        ></Step>
      );

      const children = renderSlot(props, slots, 'default');
      const hasSections = !!hasChild(children, 'FatFormSection');
      const vnode = (
        <FatFormCollectionProvider value={collection}>
          <div
            class={normalizeClassName('fat-form-steps__form', {
              'fat-form-steps__form--active': active.value,
            })}
          >
            {children}
          </div>
        </FatFormCollectionProvider>
      );

      instance.renderFormResult = {
        vnode,
        hasSections,
      };

      return null;
    };
  },
});

export const FatFormStep = FatFormStepInner as unknown as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormStepProps<Store, Request, Submit>
) => OurComponentInstance<typeof props, FatFormStepSlots, FatFormStepEvents, void>;
