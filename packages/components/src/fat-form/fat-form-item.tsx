import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { FormItem, Col, Tooltip, ColProps, CommonProps } from '@wakeadmin/component-adapter';
import { watch, computed } from '@wakeadmin/demi';
import { get, debounce, NoopObject } from '@wakeadmin/utils';
import { Inquiry } from '@wakeadmin/icons';

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
  props: declareProps<FatFormItemProps<any, any>>({
    mode: null,
    label: null,
    labelWidth: null,
    tooltip: null,
    message: null,
    inlineMessage: Boolean,
    prop: null,
    initialValue: null,
    valueType: null,
    valueProps: null,
    rules: null,
    col: null,
    width: null,
    disabled: [Boolean, Function] as any,
    hidden: [Boolean, Function] as any,
    size: null,
    dependencies: null,
    valueClassName: null,
    valueStyle: null,
    contentClassName: null,
    contentStyle: null,

    // slots here
    renderLabel: null,
    renderBefore: null,
    renderDefault: null,
    renderMessage: null,
    renderTooltip: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormItemSlots<any>>>(),
  setup(props, { attrs, expose, slots }) {
    validateFormItemProps(props);

    const form = useFatFormContext()!;
    const registry = useAtomicRegistry();
    const inheritProps = useInheritableProps();

    // 初始化: 就算是空数据也需要初始化，否则 element-ui 会报错
    form.__setInitialValue(props.prop, props.initialValue);

    // 监听 initialValue 变动
    watch(
      () => props.initialValue,
      value => {
        if (value !== undefined) {
          form.__setInitialValue(props.prop!, value);
        }
      },
      {}
    );

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
      const atom = getAtom();
      const values = typeof props.rules === 'function' ? props.rules(form.values, form) : props.rules;

      if (atom.validate) {
        const list = values == null ? [] : Array.isArray(values) ? values : [values];
        list.push({
          async validator(_rule, val, callback) {
            try {
              await atom.validate!(value, props.valueProps ?? NoopObject, form.values);
              callback();
            } catch (err) {
              // eslint-disable-next-line n/no-callback-literal
              callback(err as Error);
            }
          },
        });

        return list;
      } else {
        return values;
      }
    });

    const hasLabel = computed(() => {
      return !!(props.label || !!props.renderLabel || !!slots.label);
    });

    const hasTooltip = computed(() => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return !!(props.tooltip || props.renderTooltip || slots.tooltip);
    });

    const contentStyle = computed(() => {
      if (props.width !== undefined) {
        const w = formItemWidth(props.width);
        return { maxWidth: w };
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
      const col = (props.col ?? inheritProps?.col) as (ColProps & Partial<CommonProps>) | undefined;

      const labelSlot =
        hasTooltip.value || hasSlots(props, slots, 'label')
          ? {
              label: (
                <span>
                  {renderSlot(props, slots, 'label', instance)}
                  {props.label}
                  {!!hasTooltip.value && (
                    <Tooltip
                      v-slots={{
                        content: hasSlots(props, slots, 'tooltip')
                          ? renderSlot(props, slots, 'tooltip', instance)
                          : props.tooltip,
                      }}
                    >
                      <Inquiry class="fat-form-tooltip" />
                    </Tooltip>
                  )}
                  {form.labelSuffix}
                </span>
              ),
            }
          : // 这里要修复一下 element-ui / element-plus 对 label 的处理的一些区别
          // 显式定义了 labelWidth  需要加上 label 占位符, 否则无法撑开
          !hasLabel.value && props.labelWidth !== undefined && form.layout === 'horizontal'
          ? { label: <span /> }
          : undefined;

      let node = (
        <FormItem
          prop={props.prop}
          class={normalizeClassName(
            'fat-form-item',
            `a-${atom.name}`,
            { 'fat-form-item--hide-label': forceHideLabel.value },
            col ? undefined : attrs.class
          )}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, col ? undefined : attrs.style)}
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
            {renderSlot(props, slots, 'before', instance)}
            {atom.component(
              composeAtomProps(
                {
                  mode: mode.value ?? 'editable',
                  scene: 'form',
                  value: value.value,
                  onChange: handleChange,
                  disabled: disabled.value,
                  context: form,
                  class: props.valueClassName,
                  style: props.valueStyle,
                },
                // 外部指定的优先
                props.valueProps
              )
            )}
            {renderSlot(props, slots, 'default', instance)}
            {(props.message || hasSlots(props, slots, 'message')) && (
              <div class={normalizeClassName('fat-form-message', { 'fat-form-message--inline': inlineMessage })}>
                {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message', instance) : props.message}
              </div>
            )}
          </div>
        </FormItem>
      );

      if (col) {
        node = (
          <Col
            {...col}
            class={normalizeClassName('fat-form-col', col?.class, attrs.class)}
            style={normalizeStyle(col?.style, attrs.style)}
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
