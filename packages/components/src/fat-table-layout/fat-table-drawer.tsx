import { computed, Ref, ref, unref, watch } from '@wakeadmin/demi';
import { Button, ButtonProps, Drawer, DrawerProps } from '@wakeadmin/element-adapter';
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
import { FatTableModalMethods, FatTableModalPublicMethodKeys } from './fat-table-modal';
import { useLazyFalsy, useT } from '../hooks';

export type FatTableDrawerMethods<Item extends {}, Query extends {}> = FatTableModalMethods<Item, Query>;

export const FatTableDrawerPublicMethodKeys = FatTableModalPublicMethodKeys;

export interface FatTableDrawerSlots<Item extends {}, Query extends {}>
  extends Omit<FatTableSlots<Item, Query>, 'renderTitle'> {
  renderTitle?: (tableModalRef: FatTableDrawerMethods<Item, Query>) => any;

  renderFooter?: (tableModalRef: FatTableDrawerMethods<Item, Query>) => any;
}

export interface FatTableDrawerEvents<Item extends {}, Query extends {}> {
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface FatTableDrawerProps<Item extends {}, Query extends {}>
  extends Omit<
      FatTableProps<Item, Query>,
      'size' | keyof FatTableSlots<Item, Query> | keyof FatTableMethods<Item, Query> | keyof FatTableEvents<Item, Query>
    >,
    FatTableDrawerSlots<Item, Query>,
    Omit<DrawerProps, 'modelValue' | 'onUpdate:modelValue' | 'beforeClose'> {
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

  /**
   * 抽屉大小
   * @alias size
   */
  drawerSize?: number | string;
}

export interface FatTableDrawerGlobalConfigurations {
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

export function useFatTableDrawerRef<S extends {} = any, T extends {} = any>() {
  return ref<FatTableDrawerMethods<S, T>>();
}

const FatTableDrawerInner = declareComponent({
  name: 'FatTableDrawer',
  props: declareProps<FatTableDrawerProps<any, any>>({
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

    // drawer
    title: null,
    drawerSize: null,
    size: null,
    modal: { type: Boolean, default: true },
    modalAppendToBody: { type: Boolean, default: false },
    customClass: String,
    closeOnClickModal: { type: Boolean, default: false },
    closeOnPressEscape: { type: Boolean, default: true },
    showClose: { type: Boolean, default: true },
    destroyOnClose: { type: Boolean, default: true },
    appendToBody: { type: Boolean, default: true },
    wrapperClosable: { type: Boolean, default: false },

    // fat-table-overwrite
    layoutProps: null,
    layout: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatTableDrawerEvents<any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatTableDrawerSlots<any, any>>>(),
  setup(props, { attrs, expose, slots }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);

    const configurable = useFatConfigurable();

    const t = useT();

    const tableInstance = useFatTableRef<FatTableMethods<any, any>>();

    const tempProps: Ref<Partial<FatTableDrawerProps<any, any>>> = ref({});

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
        };
      }
      return props.layoutProps;
    });

    const open = (newProps?: Partial<FatTableDrawerProps<any, any>>) => {
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

      // 共用同一个
      const fatTableDrawerConfigurable = configurable.fatTableModal ?? {};

      return [
        (mergedPropsValue.enableCancel ?? fatTableDrawerConfigurable.enableCancel) && (
          <Button onClick={close} {...(mergedPropsValue.cancelProps ?? fatTableDrawerConfigurable.cancelProps ?? {})}>
            {mergedPropsValue.cancelText ?? fatTableDrawerConfigurable.cancelText ?? t('wkc.cancel')}
          </Button>
        ),
        (mergedPropsValue.enableConfirm ?? fatTableDrawerConfigurable.enableConfirm) && (
          <Button
            type="primary"
            onClick={confirm}
            {...(mergedPropsValue.confirmProps ?? fatTableDrawerConfigurable.confirmProps ?? {})}
          >
            {mergedPropsValue.confirmText ?? fatTableDrawerConfigurable.confirmText ?? t('wkc.confirm')}
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

      return <div class="fat-table-drawer__footer">{renderButtons()}</div>;
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
        drawerSize,
        size,
        ...other
      } = unref(mergedProps);

      return (
        <Drawer
          class={normalizeClassName(attrs.class, 'fat-table-drawer')}
          style={attrs.style}
          modelValue={visible.value}
          title={title}
          size={size ?? drawerSize}
          v-slots={{ title: renderTitle.value }}
          {...other}
          beforeClose={handleCancel as any}
          onUpdate:modelValue={handleVisibleChange}
        >
          <div class="fat-table-drawer__body">
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
          </div>
          {renderFooter.value}
        </Drawer>
      );
    };
  },
});

export const FatTableDrawer = FatTableDrawerInner as new <Item extends {} = any, Query extends {} = any>(
  props: FatTableDrawerProps<Item, Query>
) => OurComponentInstance<
  typeof props,
  FatTableDrawerSlots<Item, Query>,
  FatTableDrawerEvents<Item, Query>,
  FatTableDrawerMethods<Item, Query>
>;
