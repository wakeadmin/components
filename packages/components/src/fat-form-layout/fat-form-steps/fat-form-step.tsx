import { StepProps, Step } from '@wakeadmin/element-adapter';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { onBeforeUnmount, markRaw, ref } from '@wakeadmin/demi';

import { FatFormStepMethods, useFatFormStepsContext } from './fat-form-steps-context';
import { FatFormItemMethods, FatFormCollection, FatFormCollectionProvider } from '../../fat-form';
import { hasSlots, normalizeClassName, renderSlot } from '../../utils';

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

// TODO: 支持点击
export interface FatFormStepProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends StepProps,
    FatFormStepSlots {
  /**
   * 步骤提交。在点击下一步或者提交(最后异步)时触发, 可以在这里进行一些数据验证之类的操作，如果抛出异常则终止运行。
   */
  beforeSubmit?: (value: Store) => Promise<void>;
}

export const FatFormStep = declareComponent({
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
    const items: FatFormItemMethods[] = [];
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

    const instance: FatFormStepMethods = markRaw({
      async validate() {
        // 让管辖内的表单项进行验证
        await Promise.all(items.map(i => i.validate()));
      },
      async beforeSubmit(value: any) {
        await props.beforeSubmit?.(value);
      },
      renderStep() {
        const { title, description, icon, status } = props;
        return (
          <Step
            {...{ title, description, icon, status }}
            v-slots={{
              icon: renderSlotIfNeeded('icon'),
              title: renderSlotIfNeeded('title'),
              description: renderSlotIfNeeded('description'),
            }}
          ></Step>
        );
      },
      renderForm(status) {
        return (
          <FatFormCollectionProvider value={collection}>
            <div
              class={normalizeClassName('fat-form-steps__form', {
                'fat-form-steps__form--active': status.active,
              })}
            >
              {renderSlot(props, slots, 'default')}
            </div>
          </FatFormCollectionProvider>
        );
      },
    });

    const disposer = parent?.register(instance);

    if (disposer) {
      onBeforeUnmount(disposer);
    }

    return () => {
      return null;
    };
  },
});
