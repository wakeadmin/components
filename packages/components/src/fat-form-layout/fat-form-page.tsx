import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Button, ButtonProps, ClassValue, StyleValue } from '@wakeadmin/element-adapter';
import { computed, Ref, ref } from '@wakeadmin/demi';

import { FatFormBaseProps, FatFormEvents, FatFormMethods, FatForm, FatFormSlots } from '../fat-form';
import {
  hasSlots,
  renderSlot,
  normalizeClassName,
  inheritProps,
  ToHEmitDefinition,
  ToHSlotDefinition,
  forwardExpose,
  hasChild,
} from '../utils';
import { FatFloatFooter, FatContainer } from '../fat-layout';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { useFatConfigurable } from '../fat-configurable';

export type FatFormPageMethods<S extends {}> = FatFormMethods<S>;

export interface FatFormPageSlots<S extends {}> extends FatFormSlots<S> {
  renderTitle?: (form?: FatFormPageMethods<S>) => any;
  renderExtra?: (form?: FatFormPageMethods<S>) => any;
  renderDefault?: () => any;
}

export interface FatFormPageEvents<Store extends {}, Submit extends {} = Store> extends FatFormEvents<Store, Submit> {
  /**
   * 已取消
   */
  onCancel?: () => void;
}

export function useFatFormPageRef<Store extends {}>() {
  return ref<FatFormPageMethods<Store>>();
}

export interface FatFormPageProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormBaseProps<Store, Request, Submit>,
    FatFormPageSlots<Store>,
    FatFormPageEvents<Store, Submit> {
  /**
   * 页面布局
   */
  pageLayout?: FatFormPageLayout;

  /**
   * 布局自定义参数
   */
  pageLayoutProps?: any;

  /**
   * 页面标题
   */
  title?: string;

  /**
   * 是否开启取消按钮, 默认开启
   */
  enableCancel?: boolean;

  /**
   * 取消按钮文本， 默认为取消
   */
  cancelText?: string;

  /**
   * 自定义取消 props
   */
  cancelProps?: ButtonProps;

  /**
   * 点击取消前调用，默认行为是返回上一页。调用 done 可以执行默认行为
   */
  beforeCancel?: (done: () => void) => void;
}

export const FatFormPagePublicMethodKeys = FatFormPublicMethodKeys;

export type FatFormPageLayout = (renders: {
  class?: ClassValue;
  style?: StyleValue;

  /**
   * 子级中是否包含了 FatFormSection
   */
  includeSections?: boolean;

  /**
   * 表单实例引用
   */
  form?: Ref<FatFormMethods<any> | undefined>;

  /**
   * 渲染标题
   */
  renderTitle: () => any;

  /**
   * 渲染额外内容
   */
  renderExtra: () => any;

  /**
   * 渲染表单主体
   */
  renderForm: () => any;

  /**
   * 渲染提交按钮, 禁用时为空
   */
  renderSubmitter?: () => any;

  /**
   * 布局自定义参数
   */
  layoutProps: any;
}) => any;

const DefaultLayout: FatFormPageLayout = ctx => {
  return (
    <div class={normalizeClassName('fat-form-page', ctx.class)} style={ctx.style}>
      {ctx.includeSections ? (
        ctx.renderForm()
      ) : (
        <FatContainer
          {...ctx.layoutProps}
          v-slots={{
            title: ctx.renderTitle(),
            extra: ctx.renderExtra(),
          }}
        >
          {ctx.renderForm()}
        </FatContainer>
      )}
      {!!ctx.renderSubmitter && <FatFloatFooter>{ctx.renderSubmitter()}</FatFloatFooter>}
    </div>
  );
};

/**
 * 表单页面
 */
export const FatFormPage = declareComponent({
  name: 'FatFormPage',
  props: declareProps<FatFormPageProps<any>>({
    mode: null,
    pageLayout: null,
    pageLayoutProps: null,
    title: null,
    // preview 模式默认不渲染 submitter
    enableSubmitter: { type: Boolean, default: undefined },

    enableCancel: { type: Boolean, default: true },
    cancelText: String,
    cancelProps: null,

    submitText: String,
    submitProps: null,

    enableReset: { type: Boolean, default: false },
    resetText: String,
    resetProps: null,

    beforeCancel: null,

    // slots
    renderDefault: null,
    renderExtra: null,
    renderTitle: null,
    renderSubmitter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormPageEvents<any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormPageSlots<any> & FatFormSlots<any>>>(),
  setup(props, { slots, attrs, expose, emit }) {
    const form = ref<FatFormMethods<any>>();
    const configurable = useFatConfigurable();

    const handleCancel = () => {
      const done = () => {
        if (window.history.length > 1) {
          window.history.back();
        }

        emit('cancel');
      };

      if (props.beforeCancel) {
        props.beforeCancel(done);
      } else {
        done();
      }
    };

    const exposed = {};
    forwardExpose(exposed, FatFormPublicMethodKeys, form);
    expose(exposed);

    const renderButtons = () => {
      return [
        !!props.enableCancel && (
          <Button onClick={handleCancel} {...props.cancelProps}>
            {props.cancelText ?? configurable.fatForm?.backText ?? '取消'}
          </Button>
        ),
        !!props.enableReset && (
          <Button onClick={form.value?.reset} {...props.resetProps}>
            {props.resetText ?? configurable.fatForm?.resetText ?? '重置'}
          </Button>
        ),
        <Button onClick={form.value?.submit} type="primary" {...props.submitProps}>
          {props.submitText ?? configurable.fatForm?.saveText ?? '保存'}
        </Button>,
      ];
    };

    const enableSubmitter = computed(() => {
      return props.enableSubmitter ?? props.mode !== 'preview';
    });

    const renderSubmitter = computed(() => {
      if (!enableSubmitter.value) {
        return undefined;
      }

      return () =>
        hasSlots(props, slots, 'submitter')
          ? renderSlot(props, slots, 'submitter', form.value, renderButtons)
          : renderButtons();
    });

    return () => {
      const layout = props.pageLayout ?? configurable.fatFormPageLayout ?? DefaultLayout;
      const children = renderSlot(props, slots, 'default');
      const hasSection = hasChild(children, 'FatFormSection');

      return layout({
        class: attrs.class,
        style: attrs.style,
        form,
        includeSections: hasSection,
        layoutProps: props.pageLayoutProps,
        renderTitle: () => {
          return hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', form.value) : props.title;
        },
        renderExtra: () => {
          return renderSlot(props, slots, 'extra', form.value);
        },
        renderForm: () => {
          return (
            <FatForm ref={form} mode={props.mode} hierarchyConnect={false} {...inheritProps()} enableSubmitter={false}>
              {children}
            </FatForm>
          );
        },
        renderSubmitter: renderSubmitter.value,
      });
    };
  },
});
