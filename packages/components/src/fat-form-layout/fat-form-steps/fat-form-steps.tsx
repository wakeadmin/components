/**
 * 分布表单
 */
import { Button, Steps, Message } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps } from '@wakeadmin/h';
import { computed, ref, watch, Ref } from '@wakeadmin/demi';
import { debounce } from '@wakeadmin/utils';

import { FatForm, FatFormMethods } from '../../fat-form';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  normalizeClassName,
  OurComponentInstance,
  renderSlot,
  ToHEmitDefinition,
} from '../../utils';
import {
  FatFormStepMethods,
  FatFormStepsContextValue,
  FatFormStepState,
  provideFatFormStepsContext,
} from './fat-form-steps-context';
import { useFatConfigurable } from '../../fat-configurable';
import { FatFormStepsMethods, FatFormStepsEvents, FatFormStepsProps, FatFormStepsSlots } from './types';
import { defaultLayout } from './default-layout';
import { FatFormPublicMethodKeys } from '../../fat-form/constants';
import { useT } from '../../hooks';

export function useFatFormStepsRef<Store extends {} = any, Request extends {} = Store, Submit extends {} = Store>() {
  return ref<FatFormStepsMethods<Store, Request, Submit>>();
}

export const FatFormStepsPublicMethodKeys: (keyof FatFormStepsMethods)[] = [
  ...FatFormPublicMethodKeys,
  'goPrev',
  'goNext',
  'goto',
];

/**
 * 将分步表单的渲染提取出来，避免循环渲染问题
 */
const FatFormStepsRenderer = declareComponent({
  name: 'FatFormStepsRenderer',
  props: declareProps<{
    innerProps: {
      steps: Ref<FatFormStepMethods[]>;
      renderSubmitter?: () => any;
      exposed: FatFormStepsMethods;
      active: Ref<number>;
    } & Pick<
      FatFormStepsProps,
      'direction' | 'space' | 'alignCenter' | 'simple' | 'pageLayout' | 'layoutProps' | 'formWidth'
    >;
  }>({
    innerProps: null,
  }),
  setup(props) {
    return () => {
      const {
        steps,
        direction,
        formWidth,
        space,
        alignCenter,
        simple,
        pageLayout,
        layoutProps,
        renderSubmitter,
        exposed,
        active,
      } = props.innerProps;
      const layout = pageLayout ?? defaultLayout;

      let hasSections = false;
      const content = steps.value.map((s, index) => {
        if (s.renderFormResult) {
          const { vnode, hasSections: _hasSections } = s.renderFormResult;

          if (_hasSections) {
            hasSections = true;
          }

          return vnode;
        }

        return null;
      });
      return layout({
        form: exposed,
        vertical: direction === 'vertical',
        layoutProps,
        hasSections,
        formWidth,
        renderSteps() {
          return (
            <Steps class="fat-form-steps__steps" {...{ space, direction, alignCenter, simple, active: active.value }}>
              {steps.value.map((s, index) => {
                return s.renderStepResult;
              })}
            </Steps>
          );
        },
        renderContent() {
          return <div class="fat-form-steps__forms">{content}</div>;
        },
        renderSubmitter,
      });
    };
  },
});

const FatFormStepsInner = declareComponent({
  name: 'FatFormSteps',
  props: declareProps<FatFormStepsProps>({
    request: null,
    strict: { type: Boolean, default: true },
    pageLayout: null,
    layoutProps: null,
    formWidth: { type: [Number, String], default: undefined },

    // override
    mode: null,

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
    enableSubmitter: { type: Boolean, default: true },

    // slots
    renderSubmitter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormStepsEvents<any>>>(),
  setup(props, { attrs, slots, expose, emit }) {
    const configurable = useFatConfigurable();
    const t = useT();

    const form = ref<FatFormMethods<any>>();
    const active = ref(0);
    let remoteInitialized = false;

    // 已注册的步骤
    const steps = ref<FatFormStepMethods[]>([]);

    // 缓存传递给子步骤的状态
    const stepStates: Map<FatFormStepMethods, FatFormStepState> = new Map();

    const nextStepLoading = ref(false);
    const submitLoading = ref(false);

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

    // 重新计算 index
    const updateIndex = debounce(() => {
      steps.value.forEach((i, nIdx) => {
        const s = stepStates.get(i);
        if (s != null) {
          s.index.value = nIdx;
        }
      });
    });

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
            Message.error(t('wkc.fillForm'));
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
            Message.error(t('wkc.fillForm'));
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
            {props.prevText ?? t('wkc.previousStep')}
          </Button>
        ),
        hasNext.value && (
          <Button
            type="primary"
            {...props.nextProps}
            onClick={goNext}
            loading={props.nextProps?.loading || nextStepLoading.value || submitting.value}
          >
            {props.nextText ?? t('wkc.nextStep')}
          </Button>
        ),
        hasSubmit.value && props.mode !== 'preview' && (
          <Button type="primary" {...props.submitProps} onClick={submit} loading={submitting.value}>
            {props.submitText ?? configurable.fatForm?.saveText ?? t('wkc.save')}
          </Button>
        ),
      ];
    };

    const context: FatFormStepsContextValue = {
      register(instance) {
        steps.value.push(instance);
        const index = ref(steps.value.length - 1);
        const isActive = computed(() => {
          return index.value === active.value;
        });

        const state: FatFormStepState = {
          index,
          active: isActive,
          handleClick: () => {
            goto(index.value);
          },
          // 释放
          disposer: () => {
            const idx = steps.value.indexOf(instance);
            if (idx !== -1) {
              steps.value.splice(idx, 1);
              stepStates.delete(instance);

              updateIndex();
            }
          },
        };

        stepStates.set(instance, state);

        return state;
      },
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

    watch(active, value => {
      emit('activeChange', value);
    });

    // @ts-expect-error
    const exposed: FatFormStepsMethods<any> = {
      goPrev,
      goNext,
      goto,
      submit,
      renderButtons,
    };

    forwardExpose(exposed as any, FatFormPublicMethodKeys, form);
    expose(exposed);

    provideFatFormStepsContext(context);

    const renderSubmitter = computed(() => {
      return props.enableSubmitter
        ? () => {
            return hasSlots(props, slots, 'submitter') ? (
              renderSlot(props, slots, 'submitter', exposed)
            ) : (
              <div class="fat-form-steps__submitter">{renderButtons()}</div>
            );
          }
        : undefined;
    });

    return () => {
      const {
        mode,
        // steps 属性
        space,
        direction,
        alignCenter,
        simple,
        pageLayout,
        layoutProps,
        formWidth,
      } = props;

      const children = renderSlot(props, slots, 'default');

      return (
        <FatForm
          {...inheritProps()}
          hierarchyConnect={false}
          mode={mode}
          ref={form}
          class={normalizeClassName('fat-form-steps', attrs.class)}
          style={attrs.style}
          request={handleRequest.value}
          enableSubmitter={false}
        >
          {children}
          <FatFormStepsRenderer
            innerProps={{
              space,
              active,
              direction,
              alignCenter,
              simple,
              pageLayout,
              layoutProps,
              formWidth,
              exposed,
              steps,
              renderSubmitter: renderSubmitter.value,
            }}
          />
        </FatForm>
      );
    };
  },
});

export const FatFormSteps = FatFormStepsInner as unknown as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormStepsProps<Store, Request, Submit>
) => OurComponentInstance<
  typeof props,
  FatFormStepsSlots<Store>,
  FatFormStepsEvents<Store, Submit>,
  FatFormStepsMethods<Store, Request, Submit>
>;
