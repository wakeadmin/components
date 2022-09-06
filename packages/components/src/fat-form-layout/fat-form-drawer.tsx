import { Drawer, DrawerProps, Button, ButtonProps } from '@wakeadmin/component-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, watch, getCurrentInstance } from '@wakeadmin/demi';
import { NoopObject } from '@wakeadmin/utils';

import { FatFormMethods, FatFormProps, FatForm } from '../fat-form';
import {
  hasListener,
  hasSlots,
  inheritProps,
  normalizeClassName,
  renderSlot,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';

export interface FatFormDrawerMethods<S extends {}> {
  readonly form: FatFormMethods<S>;

  /**
   * 可以传递临时参数
   * @param tempProps
   */
  open(tempProps?: FatFormDrawerProps<S>): void;
  close(): void;
}

export interface FatFormDrawerSlots<S extends {}> {
  /**
   * 渲染标题
   */
  renderTitle?: (instance: FatFormDrawerMethods<S>) => any;

  /**
   * 渲染底部
   */
  renderFooter?: (instance: FatFormDrawerMethods<S>, buttons: () => any) => any;
}

export interface FatFormDrawerEvents<S extends {}> {
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

export interface FatFormDrawerProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<DrawerProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose' | 'size'>,
    FatFormDrawerEvents<Store>,
    Omit<FatFormProps<Store, Request, Submit>, 'onFinish'>,
    FatFormDrawerSlots<Store> {
  /**
   * 受控显示
   */
  visible?: boolean;

  /**
   * 抽屉大小
   */
  drawerSize?: string | number;

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

export const FatFormDrawer = declareComponent({
  name: 'FatFormDrawer',
  props: declareProps<FatFormDrawerProps<any>>({
    visible: Boolean,
    drawerSize: null,
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
  emits: declareEmits<ToHEmitDefinition<FatFormDrawerEvents<any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormDrawerSlots<any>>>(),
  setup(props, { attrs, expose, emit, slots }) {
    const visible = ref(false);
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

    const instance: FatFormDrawerMethods<any> = {
      get form() {
        return form.value!;
      },
      open,
      close,
    };

    expose(instance);

    return () => {
      const renderButtons = () => {
        return [
          !!props.enableCancel && (
            <Button onClick={close} {...props.cancelProps}>
              {props.cancelText ?? '取消'}
            </Button>
          ),
          !!props.enableReset && (
            <Button onClick={form.value?.reset} {...props.resetProps}>
              {props.resetText ?? '重置'}
            </Button>
          ),
          <Button onClick={form.value?.submit} type="primary" {...props.submitProps}>
            {props.submitText ?? '保存'}
          </Button>,
        ];
      };

      const renderFooter = () => {
        return <div class="fat-form-drawer__footer">{renderButtons()}</div>;
      };

      const passthroughProps = inheritProps();

      return (
        <Drawer
          modelValue={visible.value}
          onUpdate:modelValue={handleVisibleChange}
          class={normalizeClassName('fat-form-drawer', attrs.class)}
          style={attrs.style}
          size={props.drawerSize}
          modalAppendToBody={true}
          {...passthroughProps}
          {...tempProps}
          beforeClose={handleCancel}
          v-slots={{
            title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', instance) : undefined,
          }}
        >
          <div class="fat-form-drawer__body">
            {(!props.destroyOnClose || !!visible.value) && (
              <FatForm ref={form} enableSubmitter={false} onFinish={handleFinish} {...passthroughProps} {...tempProps}>
                {slots.default?.()}
              </FatForm>
            )}
          </div>
          {hasSlots(props, slots, 'footer')
            ? renderSlot(props, slots, 'footer', instance, renderButtons)
            : renderFooter()}
        </Drawer>
      );
    };
  },
});
