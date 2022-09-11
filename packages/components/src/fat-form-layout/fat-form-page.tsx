import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Button, ButtonProps, ClassValue, StyleValue } from '@wakeadmin/component-adapter';
import { getCurrentInstance, Ref, ref } from '@wakeadmin/demi';

import { FatFormProps, FatFormMethods, FatForm, FatFormSlots } from '../fat-form';
import {
  hasSlots,
  renderSlot,
  normalizeClassName,
  inheritProps,
  ToHEmitDefinition,
  hasListener,
  ToHSlotDefinition,
  forwardExpose,
} from '../utils';
import { FatFloatFooter, FatHeader } from '../fat-layout';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { useFatConfigurable } from '../fat-configurable';

export interface FatFormPageSlots<S extends {}> extends FatFormSlots<S> {
  renderTitle?: (form?: FatFormMethods<S>) => any;
  renderExtra?: (form?: FatFormMethods<S>) => any;
  renderDefault?: () => any;
}

export type FatFormPageMethods<S extends {}> = FatFormMethods<S>;

export interface FatFormPageEvents {
  /**
   * 取消事件，默认是返回上一页
   */
  onCancel?: (back: () => void) => void;
}

export function useFatFormPageRef<Store extends {}>() {
  return ref<FatFormPageMethods<Store>>();
}

export interface FatFormPageProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormProps<Store, Request, Submit>,
    FatFormPageSlots<Store>,
    FatFormPageEvents {
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
}

export const FatFormPagePublicMethodKeys = FatFormPublicMethodKeys;

export type FatFormPageLayout = (renders: {
  class?: ClassValue;
  style?: StyleValue;

  form?: Ref<FatFormMethods<any> | undefined>;

  renderTitle: () => any;
  renderExtra: () => any;

  /**
   * 渲染表单主体
   */
  renderForm: () => any;

  /**
   * 渲染提交按钮
   */
  renderSubmitter: () => any;

  /**
   * 布局自定义参数
   */
  layoutProps: any;
}) => any;

const DefaultLayout: FatFormPageLayout = ctx => {
  return (
    <div class={normalizeClassName('fat-form-page', ctx.class)} style={ctx.style}>
      <FatHeader
        {...ctx.layoutProps}
        v-slots={{
          title: ctx.renderTitle(),
          extra: ctx.renderExtra(),
        }}
      >
        {ctx.renderForm()}
        <FatFloatFooter>{ctx.renderSubmitter()}</FatFloatFooter>
      </FatHeader>
    </div>
  );
};

/**
 * 表单页面
 */
export const FatFormPage = declareComponent({
  name: 'FatFormPage',
  props: declareProps<FatFormPageProps<any>>({
    pageLayout: null,
    pageLayoutProps: null,
    title: null,
    enableSubmitter: { type: Boolean, default: true },

    enableCancel: { type: Boolean, default: true },
    cancelText: String,
    cancelProps: null,

    submitText: String,
    submitProps: null,

    enableReset: { type: Boolean, default: true },
    resetText: String,
    resetProps: null,

    // slots
    renderDefault: null,
    renderExtra: null,
    renderTitle: null,
    renderSubmitter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormPageEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormPageSlots<any>>>(),
  setup(props, { slots, attrs, expose, emit }) {
    const form = ref<FatFormMethods<any>>();
    const configurable = useFatConfigurable();
    const instance = getCurrentInstance()?.proxy;

    const handleCancel = () => {
      const back = () => {
        if (window.history.length > 1) {
          window.history.back();
        }
      };
      if (hasListener('cancel', instance)) {
        emit('cancel', back);
      } else {
        back();
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

    return () => {
      const layout = props.pageLayout ?? configurable.fatFormPageLayout ?? DefaultLayout;

      return layout({
        class: attrs.class,
        style: attrs.style,
        form,
        layoutProps: props.pageLayoutProps,
        renderTitle: () => {
          return hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', form.value) : props.title;
        },
        renderExtra: () => {
          return renderSlot(props, slots, 'extra', form.value);
        },
        renderForm: () => {
          return (
            <FatForm ref={form} hierarchyConnect={false} {...inheritProps()} enableSubmitter={false}>
              {renderSlot(props, slots, 'default')}
            </FatForm>
          );
        },
        renderSubmitter: () => {
          return props.enableSubmitter
            ? hasSlots(props, slots, 'submitter')
              ? renderSlot(props, slots, 'submitter', form.value, renderButtons)
              : renderButtons()
            : null;
        },
      });
    };
  },
});
