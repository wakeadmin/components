import { Dialog, DialogProps, Button, ButtonProps } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, watch } from '@wakeadmin/demi';
import { merge, NoopObject } from '@wakeadmin/utils';

import { FatFormMethods, FatFormEvents, FatFormBaseProps, FatFormSlots, FatForm } from '../fat-form';

import { useLazyFalsy, useT } from '../hooks';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  normalizeClassName,
  OurComponentInstance,
  renderSlot,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { useFatConfigurable } from '../fat-configurable';

export interface FatFormModalMethods<Store extends {}> extends FatFormMethods<Store> {
  /**
   * 可以传递临时参数
   * @param tempProps
   */
  open(tempProps?: FatFormModalProps<Store>): void;

  /**
   * 关闭
   */
  close(): void;
}

export interface FatFormModalSlots<S extends {}> extends Omit<FatFormSlots<S>, 'renderSubmitter'> {
  /**
   * 渲染标题
   */
  renderTitle?: (instance: FatFormModalMethods<S>) => any;

  /**
   * 渲染底部
   */
  renderFooter?: (instance: FatFormModalMethods<S>) => any;

  /**
   * 自定义提交器
   */
  renderSubmitter?: (instance: FatFormModalMethods<S>) => any;
}

export interface FatFormModalEvents<Store extends {}, Submit extends {} = Store>
  extends Omit<FatFormEvents<Store, Submit>, 'onFinish'> {
  onVisibleChange?: (visible: boolean) => void;

  /**
   * 已取消
   */
  onCancel?: () => void;

  /**
   * 保存成功
   */
  onFinish?: (values: Store) => void;
}

export interface FatFormModalProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<DialogProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose'>,
    FatFormModalEvents<Store, Submit>,
    FatFormBaseProps<Store, Request, Submit>,
    FatFormModalSlots<Store> {
  /**
   * 受控显示
   */
  visible?: boolean;

  /**
   * 是否开启取消按钮, 默认开启
   */
  enableCancel?: boolean;

  /**
   * 取消按钮文本， 默认为取消
   */
  cancelText?: string;

  /**
   * 自定义取消按钮 props
   */
  cancelProps?: ButtonProps;

  /**
   * 点击取消前调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeCancel?: (done: () => void) => void;

  /**
   * 表单保存成功后调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeFinish?: (done: () => void) => void;

  /**
   * 传入和 FatForm 兼容的组件, 默认为 FatForm
   */
  Form?: any;
  // 同上，vue 的 eslint 会自动转换大小写，fuck vue
  form?: any;
}

export function useFatFormModalRef<Store extends {} = any>() {
  return ref<FatFormModalMethods<Store>>();
}

export const FatFormModalMethodKeys = [...FatFormPublicMethodKeys, 'open', 'close'];

const FatFormModalInner = declareComponent({
  name: 'FatFormModal',
  props: declareProps<FatFormModalProps<any>>({
    visible: Boolean,
    enableSubmitter: { type: Boolean, default: true },
    cancelText: String,

    submitText: String,
    submitProps: null,

    resetText: String,
    resetProps: null,
    enableReset: { type: Boolean, default: false },

    enableCancel: { type: Boolean, default: true },
    cancelProps: null,
    destroyOnClose: { type: Boolean, default: true },

    beforeCancel: null,
    beforeFinish: null,

    // slots
    renderTitle: null,
    renderFooter: null,

    Form: null,
    form: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormModalEvents<any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormModalSlots<any>>>(),
  setup(props, { attrs, expose, emit, slots }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);
    const configurable = useFatConfigurable();
    const t = useT();

    const form = ref<FatFormMethods<any>>();
    // 临时 props
    let tempProps = {};

    watch(
      () => props.visible,
      value => {
        if (value !== visible.value) {
          visible.value = !!value;
        }
      },
      { immediate: true }
    );

    const handleVisibleChange = (value: boolean) => {
      visible.value = value;
      emit('visibleChange', value);
    };

    const handleCancel = (done: Function) => {
      const doit = () => {
        done();
        emit('cancel');
      };

      if (props.beforeCancel) {
        props.beforeCancel(doit);
      } else {
        doit();
      }
    };

    const handleFinish = (values: any) => {
      const doit = () => {
        handleVisibleChange(false);
        emit('finish', values);
      };

      if (props.beforeFinish) {
        props.beforeFinish(doit);
      } else {
        doit();
      }
    };

    const open = (p: any) => {
      tempProps = p ?? NoopObject;

      visible.value = true;
    };

    const close = () => {
      handleCancel(() => {
        handleVisibleChange(false);
      });
    };

    const renderButtons = () => {
      return [
        !!props.enableCancel && (
          <Button onClick={close} {...props.cancelProps}>
            {props.cancelText ?? configurable.fatForm?.cancelText ?? t('wkc.cancel')}
          </Button>
        ),
        !!props.enableReset && (
          <Button onClick={form.value?.reset} {...props.resetProps}>
            {props.resetText ?? configurable.fatForm?.resetText ?? t('wkc.reset')}
          </Button>
        ),
        <Button onClick={form.value?.submit} loading={form.value?.submitting} type="primary" {...props.submitProps}>
          {props.submitText ?? configurable.fatForm?.saveText ?? t('wkc.save')}
        </Button>,
      ];
    };

    const instance = {
      open,
      close,
      renderButtons,
    };

    forwardExpose(instance, FatFormPublicMethodKeys, form);

    expose(instance);

    const renderFooter = () => {
      return <div class="fat-form-modal__footer">{renderButtons()}</div>;
    };

    return () => {
      const passthroughProps = inheritProps();
      const Form = props.Form ?? props.form ?? FatForm;
      const initialValue = merge({}, passthroughProps.initialValue, (tempProps as any).initialValue);

      return (
        <Dialog
          appendToBody
          modalAppendToBody
          closeOnClickModal={false}
          closeOnPressEscape={false}
          {...passthroughProps}
          {...tempProps}
          modelValue={visible.value}
          onUpdate:modelValue={handleVisibleChange}
          class={normalizeClassName('fat-form-modal', attrs.class)}
          style={attrs.style}
          beforeClose={handleCancel}
          v-slots={{
            title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', instance) : undefined,
            footer: hasSlots(props, slots, 'footer') ? renderSlot(props, slots, 'footer', instance) : renderFooter(),
          }}
        >
          {(!props.destroyOnClose || !!lazyVisible.value) && (
            <Form
              {...passthroughProps}
              {...tempProps}
              initialValue={initialValue}
              ref={form}
              enableSubmitter={false}
              hierarchyConnect={false}
              onFinish={handleFinish}
            >
              {slots.default?.()}
            </Form>
          )}
        </Dialog>
      );
    };
  },
});

export const FatFormModal = FatFormModalInner as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormModalProps<Store, Request, Submit>
) => OurComponentInstance<
  typeof props,
  FatFormModalSlots<Store>,
  FatFormModalEvents<Store, Submit>,
  FatFormModalMethods<Store>
>;
