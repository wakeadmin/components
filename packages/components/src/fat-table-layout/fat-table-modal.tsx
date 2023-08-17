import { computed, Ref, ref, unref, watch } from '@wakeadmin/demi';
import { Button, ButtonProps, Dialog, DialogProps } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';

import { useFatConfigurable } from '../fat-configurable';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  mergeProps,
  normalizeClassName,
  OurComponentInstance,
  renderSlot,
  ToHEmitDefinition,
  ToHSlotDefinition,
  pickEnumerable,
} from '../utils';

import { FatTablePublicMethodKeys } from '../fat-table/constants';
import { FatTable } from '../fat-table/fat-table';
import { useFatTableRef } from '../fat-table/hooks';

import { FatTableEvents, FatTableMethods, FatTableProps, FatTableSlots } from '../fat-table/types';
import { useLazyFalsy, useT } from '../hooks';

export interface FatTableModalMethods<Item extends {}, Query extends {}> extends FatTableMethods<Item, Query> {
  /**
   * 显示弹窗
   *
   * 如果传入 `props` 那么会优先使用该`props`进行渲染
   * @param props
   */
  open: (props?: Partial<FatTableModalProps<any, any>>) => void;

  /**
   * 确认
   * @returns
   */
  confirm: () => void;

  /**
   * 关闭
   * @returns
   */
  close: () => void;

  /**
   * 是否处于开启状态
   */
  isOpen: () => boolean;

  /**
   * 是否处于关闭状态
   */
  isClose: () => boolean;

  /**
   * 默认按钮渲染
   * @returns
   */
  renderButtons: () => any;
}

export const FatTableModalPublicMethodKeys: (keyof FatTableModalMethods<any, any>)[] = [
  'open',
  'confirm',
  'close',
  'isClose',
  'isOpen',
  'renderButtons',
];

export interface FatTableModalSlots<Item extends {}, Query extends {}>
  extends Omit<FatTableSlots<Item, Query>, 'renderTitle'> {
  renderTitle?: (tableModalRef: FatTableModalMethods<Item, Query>) => any;

  renderFooter?: (tableModalRef: FatTableModalMethods<Item, Query>) => any;
}

export interface FatTableModalEvents<Item extends {}, Query extends {}> {
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface FatTableModalProps<Item extends {}, Query extends {}>
  extends Omit<
      FatTableProps<Item, Query>,
      | 'width'
      | keyof FatTableSlots<Item, Query>
      | keyof FatTableMethods<Item, Query>
      | keyof FatTableEvents<Item, Query>
    >,
    FatTableModalSlots<Query, Item>,
    Omit<DialogProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose'> {
  /**
   * 标题
   *
   * 优先程度低于`renderTitle`
   */
  title?: any;
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
   * 是否开启确认按钮, 默认关闭
   */
  enableConfirm?: boolean;

  /**
   * 确认按钮文本， 默认为确认
   */
  confirmText?: string;

  /**
   * 自定义确认按钮 props
   */
  confirmProps?: ButtonProps;

  /**
   * 关闭弹窗前调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeCancel?: (done: () => void) => void;

  /**
   * 关闭弹窗前调用，默认行为是关闭弹窗。调用 done 可以执行默认行为
   */
  beforeConfirm?: (done: () => void) => void;
}

export interface FatTableModalGlobalConfigurations {
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
   * 是否开启确认按钮, 默认关闭
   */
  enableConfirm?: boolean;

  /**
   * 确认按钮文本， 默认为确认
   */
  confirmText?: string;

  /**
   * 自定义确认按钮 props
   */
  confirmProps?: ButtonProps;
}

export function useFatTableModalRef<Query extends {} = any, Item extends {} = any>() {
  return ref<FatTableModalMethods<Query, Item>>();
}

const FatTableModalInner = declareComponent({
  name: 'FatTableModal',
  props: declareProps<FatTableModalProps<any, any>>({
    visible: Boolean,
    cancelText: String,
    cancelProps: null,

    confirmProps: null,
    confirmText: String,

    enableCancel: { type: Boolean, default: undefined },
    enableConfirm: { type: Boolean, default: undefined },

    beforeCancel: null,
    beforeConfirm: null,

    batchActions: null,

    // slots
    renderTitle: null,
    renderFooter: null,

    // dialog
    title: null,
    top: String,
    modal: { type: Boolean, default: true },
    modalAppendToBody: { type: Boolean, default: false },
    lockScroll: { type: Boolean, default: true },
    customClass: String,
    closeOnClickModal: { type: Boolean, default: false },
    closeOnPressEscape: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true },
    center: { type: Boolean, default: false },
    destroyOnClose: { type: Boolean, default: true },
    appendToBody: { type: Boolean, default: true },

    // fat-table-overwrite
    layoutProps: null,
    layout: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatTableModalEvents<any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatTableModalSlots<any, any>>>(),
  setup(props, { attrs, expose, slots }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);
    const t = useT();

    const configurable = useFatConfigurable();

    const tableInstance = useFatTableRef<FatTableMethods<any, any>>();

    const tempProps: Ref<Partial<FatTableModalProps<any, any>>> = ref({});

    watch(
      () => props.visible,
      val => {
        visible.value = !!val;
      },
      { immediate: true }
    );

    const handleVisibleChange = (val: boolean) => {
      visible.value = val;
    };

    const handleCancel = (done: () => void) => {
      if (props.beforeCancel) {
        props.beforeCancel(done);
      } else {
        done();
      }
    };

    const handleConfirm = (done: () => void) => {
      if (props.beforeConfirm) {
        props.beforeConfirm(done);
      } else {
        done();
      }
    };

    const mergedProps = computed(() => mergeProps(props, tempProps.value));

    /**
     * 默认情况下 在微前端下会使用微前端的布局进行渲染
     *
     * 但是在modal下 强制默认使用fatCard进行渲染
     */
    const tableLayoutProp = computed(() => {
      if (props.layout == null) {
        return {
          ...(props.layoutProps ?? {}),
          reuseBayIfNeed: false,
          border: false,
          padding: false,
        };
      }
      return props.layoutProps;
    });

    const open = (newProps?: Partial<FatTableModalProps<any, any>>) => {
      tempProps.value = newProps ?? {};
      handleVisibleChange(true);
    };

    const confirm = () => {
      handleConfirm(() => {
        handleVisibleChange(false);
      });
    };

    const close = () => {
      handleCancel(() => {
        handleVisibleChange(false);
      });
    };

    const renderButtons = () => {
      const mergedPropsValue = mergedProps.value;
      const fatTableModalConfigurable = configurable.fatTableModal ?? {};

      return [
        (mergedPropsValue.enableCancel ?? fatTableModalConfigurable.enableCancel) && (
          <Button onClick={close} {...(mergedPropsValue.cancelProps ?? fatTableModalConfigurable.cancelProps ?? {})}>
            {mergedPropsValue.cancelText ?? fatTableModalConfigurable.cancelText ?? t('wkc.cancel')}
          </Button>
        ),
        (mergedPropsValue.enableConfirm ?? fatTableModalConfigurable.enableConfirm) && (
          <Button
            type="primary"
            onClick={confirm}
            {...(mergedPropsValue.confirmProps ?? fatTableModalConfigurable.confirmProps ?? {})}
          >
            {mergedPropsValue.confirmText ?? fatTableModalConfigurable.confirmText ?? t('wkc.confirm')}
          </Button>
        ),
      ];
    };

    const instance = {
      open,
      close,
      confirm,
      isOpen: () => {
        return visible.value;
      },
      isClose: () => {
        return !visible.value;
      },
      renderButtons,
    };

    const renderTitle = computed(() => {
      if (hasSlots(mergedProps.value, slots, 'title')) {
        return renderSlot(mergedProps.value, slots, 'title', instance);
      }

      return undefined;
    });

    const renderFooter = computed(() => {
      const mergedPropsValue = mergedProps.value;
      if (hasSlots(mergedPropsValue, slots, 'footer')) {
        return renderSlot(mergedPropsValue, slots, 'footer', instance);
      }

      return <div class="fat-table-model__footer">{renderButtons()}</div>;
    });

    forwardExpose(instance, FatTablePublicMethodKeys, tableInstance);
    expose(instance);

    return () => {
      const {
        destroyOnClose,
        layout,
        visible: _visible,
        renderTitle: _renderTitle,
        renderFooter: _renderFooter,
        title,
        ...other
      } = unref(mergedProps);

      return (
        <Dialog
          class={normalizeClassName(attrs.class, 'fat-table-modal')}
          style={attrs.style}
          modelValue={visible.value}
          title={title}
          v-slots={{ title: renderTitle.value, footer: renderFooter.value }}
          {...other}
          beforeClose={handleCancel as any}
          onUpdate:modelValue={handleVisibleChange}
        >
          {(!destroyOnClose || !!lazyVisible.value) && (
            <FatTable
              {...other}
              {...inheritProps(true)}
              layout={layout}
              layoutProps={tableLayoutProp.value}
              v-slots={pickEnumerable(slots)}
              // 强制行为
              enableCacheQuery={false}
              requestOnMounted={true}
              ref={tableInstance}
            ></FatTable>
          )}
        </Dialog>
      );
    };
  },
});

export const FatTableModal = FatTableModalInner as new <Item extends {} = any, Query extends {} = any>(
  props: FatTableModalProps<Item, Query>
) => OurComponentInstance<
  typeof props,
  FatTableModalSlots<Item, Query>,
  FatTableModalEvents<Item, Query>,
  FatTableModalMethods<Item, Query>
>;
