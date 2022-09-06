import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { Button, ButtonProps } from '@wakeadmin/component-adapter';
import { getCurrentInstance, ref } from '@wakeadmin/demi';

import { FatFormProps, FatFormMethods, FatForm } from '../fat-form';
import {
  hasSlots,
  renderSlot,
  normalizeClassName,
  inheritProps,
  ToHEmitDefinition,
  hasListener,
  ToHSlotDefinition,
} from '../utils';
import { FatFloatFooter, FatHeader } from '../fat-layout';

export interface FatFormPageSlots<S extends {}> {
  renderTitle?: (form: FatFormMethods<S>) => any;
}

export interface FatFormPageMethods<S extends {}> {
  form: FatFormMethods<S>;
}

export interface FatFormPageEvents {
  /**
   * 取消事件，默认是返回上一页
   */
  onCancel?: () => void;
}

export interface FatFormPageProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormProps<Store, Request, Submit>,
    FatFormPageSlots<Store>,
    FatFormPageEvents {
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

/**
 * 表单页面
 */
export const FatFormPage = declareComponent({
  name: 'FatFormPage',
  props: declareProps<FatFormPageProps<any>>({
    title: String,
    renderTitle: null,
    enableSubmitter: { type: Boolean, default: true },
    renderSubmitter: null,
    enableCancel: { type: Boolean, default: true },
    cancelText: String,
    cancelProps: null,
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormPageEvents>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormPageSlots<any>>>(),
  setup(props, { slots, attrs, expose, emit }) {
    const form = ref<FatFormMethods<any>>();
    const instance = getCurrentInstance()?.proxy;

    const handleCancel = () => {
      if (hasListener('cancel', instance)) {
        emit('cancel');
      } else {
        if (window.history.length > 1) {
          window.history.back();
        }
      }
    };

    expose({
      get form() {
        return form.value;
      },
    });

    return () => {
      return (
        <div class={normalizeClassName('fat-form-page', attrs.class)} style={attrs.style}>
          <FatHeader
            title={props.title}
            v-slots={{
              title: hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title', form) : undefined,
            }}
          >
            <FatForm
              ref={form}
              {...inheritProps()}
              renderSubmitter={(inst, buttons) => {
                const renderButtons = () => [
                  !!props.enableCancel && (
                    <Button {...props.cancelProps} onClick={handleCancel}>
                      {props.cancelText ?? '取消'}
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
              {slots.default?.()}
            </FatForm>
          </FatHeader>
        </div>
      );
    };
  },
});
