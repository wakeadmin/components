import { Dialog, DialogProps, Button, ButtonProps } from '@wakeadmin/component-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, watch, getCurrentInstance } from '@wakeadmin/demi';
import { NoopObject } from '@wakeadmin/utils';

import { FatFormMethods, FatFormProps, FatForm } from '../fat-form';

import { useLazyFalsy } from '../hooks';
import {
  forwardExpose,
  hasListener,
  hasSlots,
  inheritProps,
  normalizeClassName,
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

export interface FatFormModalSlots<S extends {}> {
  /**
   * 渲染标题
   */
  renderTitle?: (instance: FatFormModalMethods<S>) => any;

  /**
   * 渲染底部
   */
  renderFooter?: (instance: FatFormModalMethods<S>, buttons: () => any) => any;
}

export interface FatFormModalEvents<S extends {}> {
  onVisibleChange?: (visible: boolean) => void;

  /**
   * 取消事件，默认是关闭弹窗
   */
  onCancel?: (close: Function) => void;

  /**
   * 保存成功，默认关闭弹窗
   */
  onFinish?: (values: S, close: Function) => void;
}

export interface FatFormModalProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<DialogProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose'>,
    FatFormModalEvents<Store>,
    Omit<FatFormProps<Store, Request, Submit>, 'onFinish'>,
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
   * 自定义取消 props
   */
  cancelProps?: ButtonProps;
}

export function useFatFormModalRef<Store extends {}>() {
  return ref<FatFormModalMethods<Store>>();
}

export const FatFormModalMethodKeys = [...FatFormPublicMethodKeys, 'open', 'close'];

export const FatFormModal = declareComponent({
  name: 'FatFormModal',
  props: declareProps<FatFormModalProps<any>>({
    visible: Boolean,
    enableSubmitter: { type: Boolean, default: true },
    enableReset: { type: Boolean, default: false },
    enableCancel: { type: Boolean, default: true },
    submitText: String,
    resetText: String,
    cancelText: String,
    submitProps: null,
    resetProps: null,
    cancelProps: null,
    destroyOnClose: { type: Boolean, default: true },

    // slots
    renderTitle: null,
    renderFooter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormModalEvents<any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormModalSlots<any>>>(),
  setup(props, { attrs, expose, emit, slots }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);
    const configurable = useFatConfigurable();

    const form = ref<FatFormMethods<any>>();
    // 临时 props
    let tempProps = {};

    const vm = getCurrentInstance()?.proxy;

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
      if (hasListener('cancel', vm)) {
        emit('cancel', done);
      } else {
        done();
      }
    };

    const handleFinish = (values: any) => {
      if (hasListener('finish', vm)) {
        emit('finish', values, () => {
          handleVisibleChange(false);
        });
      } else {
        handleVisibleChange(false);
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

    const instance = {
      open,
      close,
    };

    forwardExpose(instance, FatFormPublicMethodKeys, form);

    expose(instance);

    return () => {
      const renderButtons = () => {
        return [
          !!props.enableCancel && (
            <Button onClick={close} {...props.cancelProps}>
              {props.cancelText ?? configurable.fatForm?.cancelText ?? '取消'}
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

      const renderFooter = () => {
        return <div class="fat-form-modal__footer">{renderButtons()}</div>;
      };

      const passthroughProps = inheritProps();

      return (
        <Dialog
          modelValue={visible.value}
          onUpdate:modelValue={handleVisibleChange}
          class={normalizeClassName('fat-form-modal', attrs.class)}
          style={attrs.style}
          modalAppendToBody={true}
          {...passthroughProps}
          {...tempProps}
          beforeClose={handleCancel}
          v-slots={{
            title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', instance) : undefined,
            footer: hasSlots(props, slots, 'footer')
              ? renderSlot(props, slots, 'footer', instance, renderButtons)
              : renderFooter(),
          }}
        >
          {(!props.destroyOnClose || !!lazyVisible.value) && (
            <FatForm
              ref={form}
              enableSubmitter={false}
              hierarchyConnect={false}
              onFinish={handleFinish}
              {...passthroughProps}
              {...tempProps}
            >
              {slots.default?.()}
            </FatForm>
          )}
        </Dialog>
      );
    };
  },
});
