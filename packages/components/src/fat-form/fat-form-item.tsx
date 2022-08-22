import { declareComponent, declareProps } from '@wakeadmin/h';
import { FormItem } from '@wakeadmin/component-adapter';

import { Atomic } from '../atomic';

import { useFatFormContext } from './hooks';
import { FatFormItemMethods, FatFormItemProps } from './types';
import { validateFormItemProps } from './utils';
import { useAtomicRegistry } from '../hooks';
import { computed } from '@wakeadmin/demi';
import { normalizeClassName } from '../utils';

const FatFormItemInner = declareComponent({
  name: 'FatFormItem',
  props: declareProps<FatFormItemProps<any, any>>([
    'mode',
    'label',
    'renderLabel',
    'labelWidth',
    'tooltip',
    'message',
    'prop',
    'initialValue',
    'valueType',
    'valueProps',
    'rules',
    'colProps',
    'width',
    'disabled',
    'size',
    'dependencies',
  ]),
  setup(props, { attrs, expose }) {
    validateFormItemProps(props);
    const fatForm = useFatFormContext()!;
    const registry = useAtomicRegistry();

    // 初始化
    fatForm.__setInitialValue(props.prop!, props.initialValue);

    const getAtom = (): Atomic => {
      const valueType = props.valueType ?? 'text';

      const atom = typeof valueType === 'object' ? valueType : registry.registered(valueType);

      if (atom == null) {
        throw new Error(`[fat-form-item] 未能识别类型为 ${valueType} 的原件`);
      }

      return atom;
    };

    const handleChange = (value: any) => {
      fatForm.setFieldValue(props.prop, value);
    };

    const value = computed(() => {
      return fatForm.getFieldValue(props.prop);
    });

    const instance: FatFormItemMethods<any> = {
      get form() {
        return fatForm;
      },
      get value() {
        return value.value;
      },
      get prop() {
        return props.prop;
      },
      get props() {
        return props;
      },
      get disabled() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return disabled.value;
      },
    };

    const disabled = computed(() => {
      if (typeof props.disabled !== 'undefined') {
        if (typeof props.disabled === 'function') {
          return props.disabled(instance);
        }
        return props.disabled;
      }

      return fatForm.disabled;
    });

    expose(instance);

    return () => {
      const atom = getAtom();
      const mode = props.mode ?? fatForm.mode;

      return (
        <FormItem
          prop={props.prop}
          class={normalizeClassName('fat-form-item', attrs.class)}
          style={attrs.style}
          label={props.label}
          labelWidth={props.labelWidth}
          rules={disabled.value ? undefined : props.rules}
          size={props.size}
          v-slots={props.renderLabel?.bind(instance)}
        >
          {atom.component({
            mode,
            scene: 'form',
            value: value.value,
            onChange: handleChange,
            disabled: disabled.value,
            context: fatForm,
            class: props.atomicClassName,
            style: props.atomicStyle,
            ...props.valueProps,
          })}
        </FormItem>
      );
    };
  },
});

export const FatFormItem = FatFormItemInner as unknown as <S extends {}, K extends keyof AtomicProps | Atomic>(
  props: FatFormItemProps<S, K>
) => any;
