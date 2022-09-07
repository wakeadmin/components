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
} from '../utils';
import { FatFloatFooter, FatHeader, FatHeaderProps, FatHeaderSlots } from '../fat-layout';

export interface FatFormPageSlots<S extends {}> extends FatHeaderSlots, FatFormSlots<S> {}

export interface FatFormPageMethods<S extends {}> {
  form: FatFormMethods<S>;
}

export interface FatFormPageEvents {
  /**
   * 取消事件，默认是返回上一页
   */
  onCancel?: () => void;
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

/**
 * 表单页面
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
            {...props.header}
            v-slots={{
              title: renderSlot(props, slots, 'title'),
              extra: renderSlot(props, slots, 'extra'),
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
              {renderSlot(props, slots, 'default')}
            </FatForm>
          </FatHeader>
        </div>
      );
    };
  },
});
