import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { FormItem, Col } from '@wakeadmin/component-adapter';
import { watch, computed } from '@wakeadmin/demi';
import { get, debounce } from '@wakeadmin/utils';

import { Atomic } from '../atomic';

import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormItemMethods, FatFormItemProps, FatFormItemSlots } from './types';
import { formItemWidth, validateFormItemProps } from './utils';
import { useAtomicRegistry } from '../hooks';
import {
  hasSlots,
  normalizeClassName,
  normalizeStyle,
  renderSlot,
  ToHSlotDefinition,
  composeAtomProps,
} from '../utils';

const FatFormItemInner = declareComponent({
  name: 'FatFormItem',
  props: declareProps<FatFormItemProps<any, any>>([
    'mode',
    'label',
    'labelWidth',
    'tooltip',
    'message',
    'inlineMessage',
    'prop',
    'initialValue',
    'valueType',
    'valueProps',
    'rules',
    'col',
    'width',
    'disabled',
    'hidden',
    'size',
    'dependencies',
    'atomicClassName',
    'atomicStyle',
    'contentClassName',
    'contentStyle',

    // slots here
    'renderLabel',
    'renderBefore',
    'renderDefault',
    'renderMessage',
  ]),
  slots: declareSlots<ToHSlotDefinition<FatFormItemSlots<any>>>(),
  setup(props, { attrs, expose, slots }) {
    validateFormItemProps(props);

    const form = useFatFormContext()!;
    const registry = useAtomicRegistry();
    const inheritProps = useInheritableProps();

    // 初始化
    form.__setInitialValue(props.prop!, props.initialValue);

    const getAtom = (): Atomic => {
      const valueType = props.valueType ?? 'text';

      const atom = typeof valueType === 'object' ? valueType : registry.registered(valueType);

      if (atom == null) {
        throw new Error(`[fat-form-item] 未能识别类型为 ${valueType} 的原件`);
      }

      return atom;
    };

    const handleChange = (value: any) => {
      form.setFieldValue(props.prop, value);
    };

    const value = computed(() => {
      return form.getFieldValue(props.prop);
    });

    const mode = computed(() => {
      return props.mode ?? inheritProps?.mode;
    });

    const size = computed(() => {
      return props.size ?? inheritProps?.size;
    });

    const instance: FatFormItemMethods<any> = {
      get form() {
        return form;
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
      get hidden() {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        return hidden.value;
      },
      get mode() {
        return mode.value;
      },
    };

    const disabled = computed(() => {
      let d: boolean | undefined;

      if (typeof props.disabled === 'function') {
        d = props.disabled(instance);
      } else {
        d = props.disabled;
      }

      return d ?? inheritProps?.disabled;
    });

    const hidden = computed(() => {
      let h: boolean | undefined;

      if (typeof props.hidden === 'function') {
        h = props.hidden(instance);
      } else {
        h = props.hidden;
      }

      return h ?? inheritProps?.hidden;
    });

    /**
     * 是否开启字段验证
     */
    const validateEnabled = computed(() => {
      return !hidden.value && !disabled.value;
    });

    const rules = computed(() => {
      return typeof props.rules === 'function' ? props.rules(form.values, form) : props.rules;
    });

    const hasLabel = computed(() => {
      return !!(props.label || !!props.renderLabel || !!slots.label);
    });

    const contentStyle = computed(() => {
      if (props.width !== undefined) {
        return { width: formItemWidth(props.width) };
      }

      return undefined;
    });

    const forceHideLabel = computed(() => {
      return !hasLabel.value && form.layout !== 'horizontal';
    });

    const labelWidth = computed(() => {
      if (props.labelWidth !== undefined) {
        // 自动模式下尝试继承 form 的 label-width 配置
        if (props.labelWidth === 'auto' && form.labelWidth && form.labelWidth !== 'auto') {
          return form.labelWidth;
        }

        return props.labelWidth;
      } else {
        // element-plus labelWidth auto 情况下，嵌套 form item 使用会创建 label，所以当没有 label 时这里显式设置为 0
        return hasLabel.value ? undefined : '0px';
      }
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
          return get(form.values, p);
        });
      },
      debounce(values => {
        // touched 状态下才验证
        if (values == null || !form.isFieldTouched(props.prop) || !validateEnabled.value) {
          return;
        }

        // 验证自身
        form.validateField(props.prop);
      }, 500)
    );

    expose(instance);

    return () => {
      const atom = getAtom();
      const inlineMessage = form.layout === 'inline' || props.inlineMessage;

      // 这里要修复一下 element-ui / element-plus 对 label 的处理的一些区别
      const labelSlot = hasSlots(props, slots, 'label')
        ? { label: renderSlot(props, slots, 'label') }
        : // 显式定义了 labelWidth  需要加上 label 占位符, 否则无法撑开
        !hasLabel.value && props.labelWidth !== undefined && form.layout === 'horizontal'
        ? { label: <span /> }
        : undefined;

      let node = (
        <FormItem
          prop={props.prop}
          class={normalizeClassName(
            'fat-form-item',
            { 'fat-form-item--hide-label': forceHideLabel.value },
            props.col ? undefined : attrs.class
          )}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, props.col ? undefined : attrs.style)}
          label={props.label}
          labelWidth={labelWidth.value}
          rules={validateEnabled.value ? rules.value : undefined}
          size={size.value}
          v-slots={labelSlot}
        >
          <div
            class={normalizeClassName('fat-form-item__content', props.contentClassName, {
              'fat-form-item--inline-message': inlineMessage,
            })}
            style={normalizeStyle(contentStyle.value, props.contentStyle)}
          >
            {renderSlot(props, slots, 'before')}
            {atom.component(
              composeAtomProps(
                {
                  mode: mode.value ?? 'editable',
                  scene: 'form',
                  value: value.value,
                  onChange: handleChange,
                  disabled: disabled.value,
                  context: form,
                  class: props.atomicClassName,
                  style: props.atomicStyle,
                },
                // 外部指定的优先
                props.valueProps
              )
            )}
            {renderSlot(props, slots, 'default')}
            {(props.message || hasSlots(props, slots, 'message')) && (
              <div class={normalizeClassName('fat-form-message', { 'fat-form-message--inline': inlineMessage })}>
                {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message') : props.message}
              </div>
            )}
          </div>
        </FormItem>
      );

      if (props.col) {
        node = (
          <Col
            {...props.col}
            class={normalizeClassName('fat-form-col', props.col?.class, attrs.class)}
            style={normalizeStyle(props.col?.style, attrs.style)}
          >
            {node}
          </Col>
        );
      }

      return node;
    };
  },
});

export const FatFormItem = FatFormItemInner as unknown as <
  S extends {} = any,
  K extends keyof AtomicProps | Atomic = 'text'
>(
  props: FatFormItemProps<S, K>
) => any;
