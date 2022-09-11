import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Button, ButtonProps } from '@wakeadmin/component-adapter';
import { getCurrentInstance, ref } from '@wakeadmin/demi';

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
import { FatFloatFooter, FatHeader, FatHeaderProps, FatHeaderSlots } from '../fat-layout';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { useFatConfigurable } from '../fat-configurable';

export interface FatFormPageSlots<S extends {}> extends FatHeaderSlots, FatFormSlots<S> {}

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
   * 头部渲染
   */
  header?: Omit<FatHeaderProps, keyof FatHeaderSlots>;

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

/**
 * 表单页面
 * TODO: 支持自定义布局
 */
export const FatFormPage = declareComponent({
  name: 'FatFormPage',
  props: declareProps<FatFormPageProps<any>>({
    header: null,
    enableSubmitter: { type: Boolean, default: true },
    enableCancel: { type: Boolean, default: true },
    cancelText: String,
    cancelProps: null,

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

    return () => {
      return (
        <div class={normalizeClassName('fat-form-page', attrs.class)} style={attrs.style}>
          <FatHeader
            {...props.header}
            v-slots={{
              title: renderSlot(props, slots, 'title'),
              extra: renderSlot(props, slots, 'extra'),
            }}
          >
            <FatForm
              ref={form}
              hierarchyConnect={false}
              {...inheritProps()}
              renderSubmitter={(inst, buttons) => {
                const renderButtons = () => [
                  !!props.enableCancel && (
                    <Button {...props.cancelProps} onClick={handleCancel}>
                      {props.cancelText ?? configurable.fatForm?.backText ?? '取消'}
                    </Button>
                  ),
                  ...buttons(),
                ];

                return props.enableSubmitter ? (
                  hasSlots(props, slots, 'submitter') ? (
                    renderSlot(props, slots, 'submitter', inst, renderButtons)
                  ) : (
                    <FatFloatFooter>{renderButtons()}</FatFloatFooter>
                  )
                ) : null;
              }}
            >
              {renderSlot(props, slots, 'default')}
            </FatForm>
          </FatHeader>
        </div>
      );
    };
  },
});
