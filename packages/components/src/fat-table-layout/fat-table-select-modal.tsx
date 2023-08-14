import { computed, Ref, ref, unref, watch } from '@wakeadmin/demi';
import { Button, Dialog } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { omit } from '@wakeadmin/utils';

import { useFatConfigurable } from '../fat-configurable';
import {
  forwardExpose,
  hasSlots,
  inheritProps,
  mergeProps,
  normalizeClassName,
  OurComponentInstance,
  pickEnumerable,
  renderSlot,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';

import { FatTablePublicMethodKeys } from '../fat-table/constants';
import { useFatTableRef } from '../fat-table/hooks';

import { FatTableMethods, FatTableSlots } from '../fat-table/types';
import {
  FatTableModalGlobalConfigurations,
  FatTableModalMethods,
  FatTableModalProps,
  FatTableModalPublicMethodKeys,
} from './fat-table-modal';
import {
  FatTableSelect,
  FatTableSelectEvents,
  FatTableSelectMethods,
  FatTableSelectProps,
  FatTableSelectPublicMethodKeys,
} from './fat-table-select';
import { useLazyFalsy, useT } from '../hooks';

export interface FatTableSelectModalMethods<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends Omit<FatTableModalMethods<Item, Query>, keyof FatTableSelectMethods<Item, Query, Selection> | 'open'>,
    FatTableSelectMethods<Item, Query, Selection> {
  /**
   * 显示弹窗
   *
   * 如果传入 `props` 那么会优先使用该`props`进行渲染
   *
   * @remarks
   * - `multiple` 以及 `limit` 是在 `FatTableSelect`创建的时候便已经设置好了的
   *    如果需要重新设置的话 那么需要手动将`destroyOnClose`设置为 `true`
   * @param props
   */
  open: (props?: Partial<FatTableSelectModalProps<Item, Query, Selection>>) => void;
}

export const FatTableSelectModalPublicMethodKeys = [
  ...FatTableSelectPublicMethodKeys,
  ...FatTableModalPublicMethodKeys,
];

export interface FatTableSelectModalSlots<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends Omit<FatTableSlots<Item, Query>, 'renderTitle'> {
  renderTitle?: (tableModalRef: FatTableSelectModalMethods<Item, Query, Selection>) => any;

  renderFooter?: (tableModalRef: FatTableSelectModalMethods<Item, Query, Selection>) => any;
}

export interface FatTableSelectModalEvents<
  Item extends {},
  Query extends {},
  Selection extends Partial<Item> | number | string
> extends FatTableSelectEvents<Item, Query, Selection> {
  onOpen?: () => void;
  onOpened?: () => void;
  onClose?: () => void;
  onClosed?: () => void;
}

export interface FatTableSelectModalProps<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
> extends Omit<FatTableModalProps<Item, Query>, keyof FatTableSelectProps<Item, Query, Selection>>,
    FatTableSelectProps<Item, Query, Selection> {
  /**
   * 选中的时候是否自动关闭弹窗, 只有单选的情况支持,  默认为 `true`
   */
  confirmOnSelected?: boolean;
}

export type FatTableSelectModalGlobalConfigurations = FatTableModalGlobalConfigurations;

export function useFatTableSelectModalRef<
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
>() {
  return ref<FatTableSelectModalMethods<Item, Query, Selection>>();
}

const OMIT_FOR_DIALOG: (keyof FatTableSelectModalProps<any, any, any>)[] = ['rowKey', 'request', 'columns', 'multiple'];

// todo 提取出来
const FatTableSelectModalInner = declareComponent({
  name: 'FatTableSelectModal',
  props: declareProps<FatTableSelectModalProps<any, any, any>>({
    visible: Boolean,
    cancelText: String,
    cancelProps: null,

    confirmProps: null,
    confirmText: String,

    enableCancel: { type: Boolean, default: true },
    enableConfirm: { type: Boolean, default: true },

    beforeCancel: null,
    beforeConfirm: null,

    batchActions: null,

    // slots
    renderTitle: null,
    renderFooter: null,

    confirmOnSelected: { type: Boolean, default: true },

    // fat-table-select
    multiple: { type: Boolean, default: false },

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
  emits: declareEmits<ToHEmitDefinition<FatTableSelectModalEvents<any, any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatTableSelectModalSlots<any, any, any>>>(),
  setup(props, { attrs, expose, slots, emit }) {
    const visible = ref(false);
    const lazyVisible = useLazyFalsy(visible);
    const t = useT();

    const configurable = useFatConfigurable();

    const tableInstance = useFatTableRef<FatTableMethods<any, any>>();

    const tempProps: Ref<Partial<FatTableSelectModalProps<any, any, any>>> = ref({});

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

    const mergedProps = computed(() => mergeProps(props, tempProps.value) as FatTableSelectModalProps<any, any, any>);

    const tableLayoutProp = computed(() => {
      if (props.layout == null) {
        return {
          ...(props.layoutProps ?? {}),
          border: false,
          padding: false,
        };
      }
      return props.layoutProps;
    });

    const open = (newProps?: Partial<FatTableSelectModalProps<any, any, any>>) => {
      tempProps.value = newProps ?? {};
      handleVisibleChange(true);
    };

    const close = () => {
      handleCancel(() => {
        handleVisibleChange(false);
      });
    };

    const confirm = () => {
      handleConfirm(() => {
        handleVisibleChange(false);
      });
    };

    const renderButtons = () => {
      const mergedPropsValue = mergedProps.value;
      const fatTableSelectModalConfigurable = configurable.fatTableSelectModal ?? {};
      return [
        (mergedPropsValue.enableCancel ?? fatTableSelectModalConfigurable.enableCancel) && (
          <Button
            onClick={close}
            {...(mergedPropsValue.cancelProps ?? fatTableSelectModalConfigurable.cancelProps ?? {})}
          >
            {mergedPropsValue.cancelText ?? fatTableSelectModalConfigurable.cancelText ?? t('wkc.cancel')}
          </Button>
        ),
        (mergedPropsValue.enableConfirm ?? fatTableSelectModalConfigurable.enableConfirm) && (
          <Button
            type="primary"
            onClick={confirm}
            {...(mergedPropsValue.confirmProps ?? fatTableSelectModalConfigurable.confirmProps ?? {})}
          >
            {mergedPropsValue.confirmText ?? fatTableSelectModalConfigurable.confirmText ?? t('wkc.confirm')}
          </Button>
        ),
      ];
    };

    const handleChange: FatTableSelectModalProps['onChange'] = evt => {
      if (mergedProps.value.onChange) {
        mergedProps.value.onChange(evt);
      } else {
        emit('change', evt);
      }

      if (!props.multiple && props.confirmOnSelected) {
        // 关闭弹窗
        confirm();
      }
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

    forwardExpose(instance, [...FatTableSelectPublicMethodKeys, ...FatTablePublicMethodKeys], tableInstance);
    expose(instance);

    return () => {
      const {
        destroyOnClose,
        layout,
        visible: _visible,
        renderTitle: _renderTitle,
        renderFooter: _renderFooter,
        title,
        // ignore
        enableConfirm: _enableConfirm,
        enableCancel: _enableCancel,
        confirmOnSelected: _confirmOnSelected,
        ...other
      } = unref(mergedProps);

      // 透传的参数
      const passthroughProps = {
        ...inheritProps(true),
        ...other,
      };

      return (
        <Dialog
          class={normalizeClassName(attrs.class, 'fat-table-modal')}
          style={attrs.style}
          modelValue={visible.value}
          title={title}
          v-slots={{ title: renderTitle.value, footer: renderFooter.value }}
          {...omit(passthroughProps, OMIT_FOR_DIALOG)}
          beforeClose={handleCancel as any}
          onUpdate:modelValue={handleVisibleChange}
        >
          {(!destroyOnClose || !!lazyVisible.value) && (
            <FatTableSelect
              {...passthroughProps}
              v-slots={pickEnumerable(slots)}
              layout={layout}
              layoutProps={tableLayoutProp.value}
              // 强制行为
              requestOnMounted={true}
              ref={tableInstance}
              onChange={handleChange}
            ></FatTableSelect>
          )}
        </Dialog>
      );
    };
  },
});

export const FatTableSelectModal = FatTableSelectModalInner as new <
  Item extends {} = any,
  Query extends {} = any,
  Selection extends Partial<Item> | number | string = any
>(
  props: FatTableSelectModalProps<Item, Query, Selection>
) => OurComponentInstance<
  typeof props,
  FatTableSelectModalSlots<Item, Query, Selection>,
  FatTableSelectModalEvents<Item, Query, Selection>,
  FatTableSelectModalMethods<Item, Query, Selection>
>;
