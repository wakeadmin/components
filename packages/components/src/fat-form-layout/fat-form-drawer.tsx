import { Drawer, DrawerProps, Button, ButtonProps } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, watch } from '@wakeadmin/demi';
import { NoopObject } from '@wakeadmin/utils';

import { FatFormMethods, FatFormProps, FatForm } from '../fat-form';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  normalizeClassName,
  renderSlot,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';
import { useLazyFalsy } from '../hooks';
import { useFatConfigurable } from '../fat-configurable';

export interface FatFormDrawerMethods<Store extends {}> extends FatFormMethods<Store> {
  /**
   * 可以传递临时参数
   * @param tempProps
   */
  open(tempProps?: FatFormDrawerProps<Store>): void;

  /**
   * 关闭
   */
  close(): void;
}

export const FatFormDrawerMethodKeys = [...FatFormPublicMethodKeys, 'open', 'close'];

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
  /**
   * 可视状态变动
   */
  onVisibleChange?: (visible: boolean) => void;

  /**
   * 已取消
   */
  onCancel?: () => void;

  /**
   * 保存成功
   */
  onFinish?: (values: S) => void;
}

export interface FatFormDrawerProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<DrawerProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose' | 'size'>,
    FatFormDrawerEvents<Store>,
    Omit<FatFormProps<Store, Request, Submit>, 'onFinish'>,
    FatFormDrawerSlots<Store> {
  /**
   * 受控显示, 你也可以使用 open 实例方法
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

  /**
   * 点击取消前调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeCancel?: (done: () => void) => void;

  /**
   * 表单保存成功后调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeFinish?: (done: () => void) => void;
}

/**
 * 实例引用 hook
 */
export function useFatFormDrawerRef<Store extends {}>() {
  return ref<FatFormDrawerMethods<Store>>();
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

    beforeCancel: null,
    beforeFinish: null,

    // slots
    renderTitle: null,
    renderFooter: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormDrawerEvents<any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormDrawerSlots<any>>>(),
  setup(props, { attrs, expose, emit, slots }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);
    const configurable = useFatConfigurable();
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
        emit('finish', values);
        handleVisibleChange(false);
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

    const instance = {
      open,
      close,
    };

    // 转发 fat-form props
    forwardExpose(instance, FatFormPublicMethodKeys, form);

    expose(instance);

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
      return <div class="fat-form-drawer__footer">{renderButtons()}</div>;
    };

    return () => {
      const passthroughProps = inheritProps();

      return (
        <Drawer
          modelValue={visible.value}
          onUpdate:modelValue={handleVisibleChange}
          class={normalizeClassName('fat-form-drawer', attrs.class)}
          style={attrs.style}
          size={props.drawerSize}
          modalAppendToBody={true}
          wrapperClosable={false}
          closeOnClickModal={false}
          closeOnPressEscape={false}
          {...passthroughProps}
          {...tempProps}
          beforeClose={handleCancel}
          v-slots={{
            title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', instance) : undefined,
          }}
        >
          <div class="fat-form-drawer__body">
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
          </div>
          {hasSlots(props, slots, 'footer')
            ? renderSlot(props, slots, 'footer', instance, renderButtons)
            : renderFooter()}
        </Drawer>
      );
    };
  },
});
