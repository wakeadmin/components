/**
 * 分布表单
 */
import { Button, Steps, Message } from '@wakeadmin/element-adapter';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { computed, ref, watch } from '@wakeadmin/demi';

import { FatForm, FatFormMethods } from '../../fat-form';
import { forwardExpose, inheritProps, normalizeClassName, renderSlot } from '../../utils';
import { FatFormStepMethods, FatFormStepsContextValue, provideFatFormStepsContext } from './fat-form-steps-context';
import { useFatConfigurable } from '../../fat-configurable';
import { FatFormStepsMethods, FatFormStepsProps } from './types';
import { defaultLayout } from './default-layout';
import { FatFormPublicMethodKeys } from '../../fat-form/constants';

export function useFatFormSteps<Store extends {} = any, Request extends {} = Store, Submit extends {} = Store>() {
  return ref<FatFormStepsMethods<Store, Request, Submit>>();
}

export const FatFormSteps = declareComponent({
  name: 'FatFormSteps',
  props: declareProps<FatFormStepsProps>({
    request: null,
    strict: { type: Boolean, default: true },
    pageLayout: null,
    layoutProps: null,
    formWidth: { type: [Number, String], default: undefined },

    // steps 属性
    initialActive: { type: Number, default: undefined },
    space: { type: [String, Number], default: 250 },
    direction: null,
    alignCenter: { type: Boolean, default: true },
    simple: { type: Boolean, default: undefined },

    // submitter
    prevText: null,
    prevProps: null,
    nextText: null,
    nextProps: null,
    submitText: null,
    submitProps: null,
  }),
  setup(props, { attrs, slots, expose }) {
    const configurable = useFatConfigurable();
    const form = ref<FatFormMethods<any>>();
    const active = ref(0);
    let remoteInitialized = false;
    const steps = ref<FatFormStepMethods[]>([]);
    const nextStepLoading = ref(false);
    const submitLoading = ref(false);

    const hasSections = computed(() => {
      return steps.value.some(i => i.hasSections);
    });

    const handleRequest = computed(() => {
      if (props.request == null) {
        return undefined;
      }

      return async () => {
        const result = await props.request!();

        if (result.active != null) {
          remoteInitialized = true;
          active.value = result.active;
        }

        return result.values;
      };
    });

    const context: FatFormStepsContextValue = {
      register(instance) {
        steps.value.push(instance);

        return () => {
          const idx = steps.value.indexOf(instance);
          if (idx !== -1) {
            steps.value.splice(idx, 1);
          }
        };
      },
    };

    const hasNext = computed(() => {
      return active.value < steps.value.length - 1;
    });

    const hasPrev = computed(() => {
      return active.value > 0;
    });

    const hasSubmit = computed(() => {
      if (props.strict) {
        return !hasNext.value;
      }

      // 非严格模式，始终显示提交按钮
      return true;
    });

    const submitting = computed(() => {
      return form.value?.submitting || submitLoading.value;
    });

    const goPrev = async () => {
      if (!hasPrev.value) {
        return;
      }

      // 前往上一步，不需要验证
      active.value--;
    };

    const goNext = async () => {
      if (!hasNext.value) {
        return;
      }

      const index = active.value;

      try {
        nextStepLoading.value = true;
        const step = steps.value[index];

        // 严格模式需要进行表单验证
        if (props.strict) {
          try {
            await step.validate();
          } catch (err) {
            Message.error('请按照要求完成表单填写');
            return;
          }
        }

        await step.beforeSubmit(form.value?.values);

        if (active.value !== index) {
          // 进行了其他步骤, 任务取消
          return;
        }

        // 下一步
        active.value = index + 1;
      } catch (err) {
        if (active.value !== index) {
          // 进行了其他步骤, 任务取消
          return;
        }

        Message.error((err as Error).message);
      } finally {
        nextStepLoading.value = false;
      }
    };

    const goto = async (index: number) => {
      if (index < 0 || index >= steps.value.length) {
        return;
      }

      // 严格模式只能点击前面的步骤
      if (props.strict) {
        if (index < active.value) {
          active.value = index;
          return;
        }

        // 下一步
        if (index === active.value + 1) {
          goNext();
          return;
        }

        return;
      }

      // 非严格模式可以自由跳转
      active.value = index;
    };

    /**
     * 表单提交，首先进行验证，如果某一步验证失败，会激活验证失败的 step
     */
    const submit = async () => {
      if (props.strict) {
        // 严格模式，直接触发表单提交即可
        await form.value?.submit();
        return;
      }

      try {
        submitLoading.value = true;

        // 分布验证
        for (let i = 0; i < steps.value.length; i++) {
          try {
            const step = steps.value[i];
            await step.validate();
          } catch (e) {
            active.value = i;
            Message.error('请按照要求完成表单填写');
            return;
          }
        }

        // 所有验证通过，提交
        await form.value?.submit();
      } finally {
        submitLoading.value = false;
      }
    };

    const renderButtons = () => {
      return [
        hasPrev.value && (
          <Button type="primary" {...props.prevProps} onClick={goPrev} loading={submitting.value}>
            {props.prevText ?? '上一步'}
          </Button>
        ),
        hasNext.value && (
          <Button
            type="primary"
            {...props.nextProps}
            onClick={goNext}
            loading={props.nextProps?.loading || nextStepLoading.value || submitting.value}
          >
            {props.nextText ?? '下一步'}
          </Button>
        ),
        hasSubmit.value && (
          <Button type="primary" {...props.submitProps} onClick={submit} loading={submitting.value}>
            {props.submitText ?? configurable.fatForm?.saveText ?? '保存'}
          </Button>
        ),
      ];
    };

    watch(
      () => props.initialActive,
      value => {
        if (remoteInitialized) {
          return;
        }

        if (typeof value === 'number') {
          active.value = value;
        }
      },
      { immediate: true }
    );

    // @ts-expect-error
    const exposed: FatFormStepsMethods<any> = {
      goPrev,
      goNext,
      goto,
      submit,
    };

    forwardExpose(exposed as any, FatFormPublicMethodKeys, form);
    expose(exposed);

    provideFatFormStepsContext(context);

    return () => {
      const {
        // steps 属性
        space,
        direction,
        alignCenter,
        simple,
      } = props;

      const layout = props.pageLayout ?? defaultLayout;
      const children = renderSlot(props, slots, 'default');

      return (
        <FatForm
          {...inheritProps()}
          ref={form}
          class={normalizeClassName('fat-form-steps', attrs.class)}
          style={attrs.style}
          request={handleRequest.value}
          enableSubmitter={false}
        >
          {layout({
            form: exposed,
            vertical: direction === 'vertical',
            layoutProps: props.layoutProps,
            hasSections: hasSections.value,
            formWidth: props.formWidth,
            renderSteps() {
              return (
                <Steps
                  class="fat-form-steps__steps"
                  {...{ space, direction, alignCenter, simple, active: active.value }}
                >
                  {steps.value.map((s, index) => {
                    return s.renderStep({ index, active: active.value === index }, () => goto(index));
                  })}
                </Steps>
              );
            },
            renderContent() {
              return (
                <div class="fat-form-steps__forms">
                  {steps.value.map((s, index) => {
                    return s.renderForm({ index, active: active.value === index });
                  })}
                </div>
              );
            },
            renderSubmitter() {
              return <div class="fat-form-steps__submitter">{renderButtons()}</div>;
            },
          })}

          {children}
        </FatForm>
      );
    };
  },
});
