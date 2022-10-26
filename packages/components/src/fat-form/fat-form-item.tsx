import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { FormItem, Col, Tooltip, ColProps, CommonProps } from '@wakeadmin/element-adapter';
import { watch, computed, onBeforeUnmount } from '@wakeadmin/demi';
import { get, debounce, NoopObject, equal } from '@wakeadmin/utils';
import { Inquiry } from '@wakeadmin/icons';

import { Atomic, BaseAtomicContext } from '../atomic';

import { useFatFormCollection, useFatFormContext, useInheritableProps } from './hooks';
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
  toArray,
  takeString,
  filterStringByTrim,
  filterStringByRegexp,
  OurComponentInstance,
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
    placeholder: null,
    rules: null,
    required: { type: Boolean, default: undefined },
    col: null,
    width: null,
    disabled: { type: [Boolean, Function] as any, default: undefined },
    hidden: { type: [Boolean, Function] as any, default: undefined },
    preserve: { type: Boolean, default: undefined },
    clearable: { type: Boolean, default: undefined },
    hideMessageOnPreview: { type: Boolean, default: undefined },
    hideOnEdit: { type: Boolean, default: undefined },
    hideOnPreview: { type: Boolean, default: undefined },

    size: null,
    dependencies: null,
    valueClassName: null,
    valueStyle: null,
    contentClassName: null,
    contentStyle: null,
    convert: null,
    transform: null,
    trim: { type: Boolean, default: false },
    filter: { type: [RegExp, Function] as any, default: undefined },

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
    const collection = useFatFormCollection();
    const registry = useAtomicRegistry();
    const inheritedProps = useInheritableProps();

    // 初始化: 就算是空数据也需要初始化，否则 element-ui 会报错
    form.__setInitialValue(props.prop, props.initialValue);

    // 监听 initialValue 变动
    watch(
      () => props.initialValue,
      (value, oldValue) => {
        if (value === undefined || value === oldValue || equal(value, oldValue)) {
          return;
        }

        form.__setInitialValue(props.prop!, value);
      },
      {}
    );

    const atom = computed((): Atomic => {
      const valueType = props.valueType ?? 'text';

      const a = typeof valueType === 'object' ? valueType : registry.registered(valueType);

      if (a == null) {
        throw new Error(`[fat-form-item] 未能识别类型为 ${valueType} 的原件`);
      }

      return a;
    });

    const beforeChange = computed<((value: any) => any) | undefined>(() => {
      if (!props.trim && !props.filter) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return (value: any) => {
        if (props.trim) {
          value = filterStringByTrim(value);
        }

        if (props.filter != null) {
          if (props.filter instanceof RegExp) {
            value = filterStringByRegexp(value, props.filter);
          } else if (typeof props.filter === 'function') {
            value = props.filter(value);
          }
        }

        return value;
      };
    });

    const handleChange = (value: any) => {
      if (beforeChange.value) {
        value = beforeChange.value(value);
      }

      form.setFieldValue(props.prop, value);
    };

    const value = computed(() => {
      return form.getFieldValue(props.prop);
    });

    const mode = computed(() => {
      return props.mode ?? inheritedProps?.mode ?? 'editable';
    });

    const size = computed(() => {
      return props.size ?? inheritedProps?.size;
    });

    const clearable = computed(() => {
      return props.clearable ?? inheritedProps?.clearable;
    });

    const preserve = computed(() => {
      return props.preserve ?? inheritedProps?.preserve ?? true;
    });

    const hideMessage = computed(() => {
      if (mode.value === 'preview' && (props.hideMessageOnPreview ?? inheritedProps?.hideMessageOnPreview ?? true)) {
        return true;
      }
      return false;
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
      get clearable() {
        return clearable.value;
      },
      get preserve() {
        return preserve.value;
      },
      get mode() {
        return mode.value;
      },
      get atom() {
        return atom.value;
      },
      get transform() {
        return props.transform;
      },
      get convert() {
        return props.convert;
      },
      validate() {
        return form.validateField(props.prop);
      },
    };

    const disabled = computed(() => {
      let d: boolean | undefined;

      if (typeof props.disabled === 'function') {
        d = props.disabled(instance);
      } else {
        d = props.disabled;
      }

      return d ?? inheritedProps?.disabled;
    });

    const hidden = computed(() => {
      let h: boolean | undefined;

      if (typeof props.hidden === 'function') {
        h = props.hidden(instance);
      } else {
        h = props.hidden;
      }

      return h ?? inheritedProps?.hidden;
    });

    const alive = computed(() => {
      if (mode.value === 'preview') {
        if (props.hideOnPreview ?? atom.value.editOnly) {
          return false;
        }
      } else {
        if (props.hideOnEdit ?? atom.value.previewOnly) {
          return false;
        }
      }

      return true;
    });

    /**
     * 是否开启字段验证
     */
    const validateEnabled = computed(() => {
      return !hidden.value && !disabled.value && mode.value !== 'preview';
    });

    const rules = computed(() => {
      let values = typeof props.rules === 'function' ? props.rules(form.values, form) : props.rules;

      if (props.required) {
        values = toArray(values);

        // 检查是否已经包含了 required 验证规则
        if (!values.some(i => i.required)) {
          values.unshift({
            required: true,
            message: `${takeString(props.label)}不能为空`,
          });
        }
      }

      if (atom.value.validate) {
        // 原件内部验证器
        values = toArray(values);
        values.push({
          async validator(_rule, val, callback) {
            try {
              await atom.value.validate!(value.value, props.valueProps ?? NoopObject, form.values);
              callback();
            } catch (err) {
              // eslint-disable-next-line n/no-callback-literal
              callback(err as Error);
            }
          },
          trigger: atom.value.validateTrigger,
        });

        return values;
      }

      return values;
    });

    const normalizedCol = computed<(ColProps & CommonProps) | undefined>(() => {
      const val = props.col ?? inheritedProps?.col;

      if (!val) {
        return undefined;
      }

      if (typeof val === 'number') {
        return { span: val } as ColProps;
      }

      return val;
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

    const atomProps = computed(() => {
      const target: Record<string, any> = {
        mode: mode.value,
        scene: 'form',
        value: value.value,
        onChange: handleChange,
        context: {
          label: props.label,
          prop: props.prop,
          values: form.values,
        } as BaseAtomicContext,
        class: props.valueClassName,
        style: normalizeStyle(contentStyle.value, props.valueStyle),
      };

      if (props.placeholder != null) {
        target.placeholder = props.placeholder;
      }

      if (disabled.value !== undefined) {
        target.disabled = disabled.value;
      }

      if (clearable.value !== undefined) {
        target.clearable = clearable.value;
      }

      return composeAtomProps(
        target,
        // 外部指定的优先
        props.valueProps
      );
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

    watch(
      () => validateEnabled.value,
      enabled => {
        if (!enabled) {
          // 通知表单移除
          form.clearValidate(props.prop);
        }
      }
    );

    expose(instance);

    // 注册表单项
    form.__registerFormItem(instance);

    // 有些容器需要收集表单信息
    const disposeCollection = collection?.registerItem(instance);

    onBeforeUnmount(() => {
      form.__unregisterFormItem(instance);

      disposeCollection?.();
    });

    return () => {
      if (!alive.value) {
        return null;
      }

      const inlineMessage = form.layout === 'inline' || props.inlineMessage;
      const col = normalizedCol.value;

      const labelSlot =
        hasTooltip.value || hasLabel.value
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

      const message = (props.message || hasSlots(props, slots, 'message')) && !hideMessage.value && (
        <div class={normalizeClassName('fat-form-message', { 'fat-form-message--inline': inlineMessage })}>
          {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message', instance) : props.message}
        </div>
      );

      let node = (
        <FormItem
          prop={props.prop}
          class={normalizeClassName(
            'fat-form-item',
            `a-${atom.value.name}`,
            `fat-form-item--${mode.value}`,
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
            style={props.contentStyle}
          >
            {renderSlot(props, slots, 'before', instance)}
            {atom.value.component(atomProps.value)}
            {renderSlot(props, slots, 'default', instance)}
            {inlineMessage && message}
          </div>
          {!inlineMessage && message}
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

export const FatFormItem = FatFormItemInner as new <
  Store extends {} = any,
  Request extends {} = Store,
  ValueType extends keyof AtomicProps = 'text'
>(
  props: FatFormItemProps<Store, Request, ValueType>
) => OurComponentInstance<typeof props, FatFormItemSlots<Store>, {}, FatFormItemMethods<Store>>;
