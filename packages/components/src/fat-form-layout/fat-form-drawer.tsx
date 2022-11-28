import { Drawer, DrawerProps, Button, ButtonProps } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { ref, watch } from '@wakeadmin/demi';
import { NoopObject } from '@wakeadmin/utils';

import { FatFormMethods, FatFormBaseProps, FatFormSlots, FatForm, FatFormEvents } from '../fat-form';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
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

export interface FatFormDrawerSlots<S extends {}> extends Omit<FatFormSlots<S>, 'renderSubmitter'> {
  /**
   * 渲染标题
   */
  renderTitle?: (instance: FatFormDrawerMethods<S>) => any;

  /**
   * 渲染底部
   */
  renderFooter?: (instance: FatFormDrawerMethods<S>) => any;

  /**
   * 自定义提交器渲染
   */
  renderSubmitter?: (instance: FatFormDrawerMethods<S>) => any;
}

export interface FatFormDrawerEvents<Store extends {}, Submit extends {} = Store>
  extends Omit<FatFormEvents<Store, Submit>, 'onFinish'> {
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
  onFinish?: (values: Store) => void;

  /**
   * 传入和 FatForm 兼容的组件, 默认为 FatForm
   */
  Form?: any;
  // 同上，vue 的 eslint 会自动转换大小写，fuck vue
  form?: any;
}

export interface FatFormDrawerProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<DrawerProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose' | 'size'>,
    FatFormDrawerEvents<Store, Submit>,
    FatFormBaseProps<Store, Request, Submit>,
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

export const FatFormDrawerMethodKeys = [...FatFormPublicMethodKeys, 'open', 'close'];

/**
 * 实例引用 hook
 */
export function useFatFormDrawerRef<Store extends {} = any>() {
  return ref<FatFormDrawerMethods<Store>>();
}

const FatFormDrawerInner = declareComponent({
  name: 'FatFormDrawer',
  // NOTE: 这里要注意，不止这里定义的所有字段都可以通过 props 访问，只有下面函数参数中声明的 props 才支持
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

    Form: null,
    form: null,
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

    const instance = {
      open,
      close,
      renderButtons,
    };

    // 转发 fat-form props
    forwardExpose(instance, FatFormPublicMethodKeys, form);

    expose(instance);

    const renderFooter = () => {
      return <div class="fat-form-drawer__footer">{renderButtons()}</div>;
    };

    return () => {
      const passthroughProps = inheritProps();
      const Form = props.Form ?? props.form ?? FatForm;

      return (
        <Drawer
          appendToBody
          modalAppendToBody
          wrapperClosable={false}
          closeOnClickModal={false}
          closeOnPressEscape={false}
          {...passthroughProps}
          {...tempProps}
          modelValue={visible.value}
          onUpdate:modelValue={handleVisibleChange}
          class={normalizeClassName('fat-form-drawer', attrs.class)}
          style={attrs.style}
          size={props.drawerSize}
          beforeClose={handleCancel}
          v-slots={{
            title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', instance) : undefined,
          }}
        >
          <div class="fat-form-drawer__body">
            {(!props.destroyOnClose || !!lazyVisible.value) && (
              <Form
                {...passthroughProps}
                {...tempProps}
                ref={form}
                enableSubmitter={false}
                hierarchyConnect={false}
                onFinish={handleFinish}
              >
                {slots.default?.()}
              </Form>
            )}
          </div>
          {hasSlots(props, slots, 'footer') ? renderSlot(props, slots, 'footer', instance) : renderFooter()}
        </Drawer>
      );
    };
  },
});

export const FatFormDrawer = FatFormDrawerInner as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormDrawerProps<Store, Request, Submit>
) => OurComponentInstance<
  typeof props,
  FatFormDrawerSlots<Store>,
  FatFormDrawerEvents<Store, Submit>,
  FatFormDrawerMethods<Store>
>;
