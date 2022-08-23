import { declareComponent, declareProps } from '@wakeadmin/h';
import { FormItem } from '@wakeadmin/component-adapter';
import { watch, computed } from '@wakeadmin/demi';
import { get, debounce } from '@wakeadmin/utils';

import { Atomic } from '../atomic';

import { useFatFormContext } from './hooks';
import { FatFormItemMethods, FatFormItemProps } from './types';
import { validateFormItemProps } from './utils';
import { useAtomicRegistry } from '../hooks';
import { normalizeClassName, normalizeStyle } from '../utils';

const FatFormItemInner = declareComponent({
  name: 'FatFormItem',
  props: declareProps<FatFormItemProps<any, any>>([
    'mode',
    'label',
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
    'hidden',
    'size',
    'dependencies',
    'atomicClassName',
    'atomicStyle',
    'renderLabel',
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

    const hidden = computed(() => {
      return typeof props.hidden === 'function' ? props.hidden(instance) : props.hidden;
    });

    /**
     * 是否开启字段验证
     */
    const validateEnabled = computed(() => {
      return !hidden.value && !disabled.value;
    });

    const rules = computed(() => {
      return typeof props.rules === 'function' ? props.rules(fatForm.values, fatForm) : props.rules;
    });

    // 监听 dependencies 重新进行验证
    watch(
      (): any[] | undefined => {
        if (props.dependencies == null) {
          return;
        }

        const paths = Array.isArray(props.dependencies) ? props.dependencies : [props.dependencies];

        // eslint-disable-next-line consistent-return
        return paths.map(p => {
          return get(fatForm.values, p);
        });
      },
      debounce(values => {
        // touched 状态下才验证
        if (values == null || !fatForm.isFieldTouched(props.prop) || !validateEnabled.value) {
          return;
        }

        // 验证自身
        fatForm.validateField(props.prop);
      }, 500)
    );

    expose(instance);

    return () => {
      const atom = getAtom();
      const mode = props.mode ?? fatForm.mode;

      return (
        <FormItem
          prop={props.prop}
          class={normalizeClassName('fat-form-item', attrs.class)}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, attrs.style)}
          label={props.label}
          labelWidth={props.labelWidth}
          rules={validateEnabled.value ? rules.value : undefined}
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

export const FatFormItem = FatFormItemInner as unknown as <
  S extends {} = any,
  K extends keyof AtomicProps | Atomic = 'text'
>(
  props: FatFormItemProps<S, K>
) => any;
