import { computed, onBeforeUnmount, watch, ref } from '@wakeadmin/demi';
import { Col, ColProps, CommonProps, FormItem, Tooltip } from '@wakeadmin/element-adapter';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { InquiryFill } from '@wakeadmin/icons';
import { debounce, equal, get, NoopObject } from '@wakeadmin/utils';

import { Atomic, AtomicValidateTrigger, BaseAtomicContext } from '../atomic';

import { useAtomicRegistry, useT } from '../hooks';
import {
  composeAtomProps,
  filterStringByRegexp,
  filterStringByTrim,
  hasSlots,
  normalizeClassName,
  normalizeStyle,
  OurComponentInstance,
  renderSlot,
  takeString,
  toArray,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';
import { useFatFormCollection, useFatFormContext, useInheritableProps } from './hooks';
import { FatFormItemEvents, FatFormItemMethods, FatFormItemProps, FatFormItemSlots } from './types';
import { formItemWidth, validateFormItemProps } from './utils';

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
    requiredMessage: null,
    col: null,
    width: null,
    maxWidth: null,
    minWidth: null,
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
  emits: declareEmits<ToHEmitDefinition<FatFormItemEvents<any>>>(),
  setup(props, { attrs, expose, slots, emit }) {
    validateFormItemProps(props);

    const form = useFatFormContext()!;
    const collection = useFatFormCollection();
    const registry = useAtomicRegistry();
    const inheritedProps = useInheritableProps();
    const t = useT();

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

    const handleChange = (val: any) => {
      if (beforeChange.value) {
        val = beforeChange.value(val);
      }

      const oldValue = instance.value;
      if (val !== oldValue) {
        form.setFieldValue(props.prop, val);

        emit('valueChange', { value: val, oldValue, instance });
      }
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

    const dynamicValidator = ref<[() => Promise<void>, AtomicValidateTrigger | undefined] | undefined>();

    /**
     * 注册动态验证器
     * @param validator
     * @returns
     */
    const registerDynamicValidator = (validator: () => Promise<void>, trigger?: AtomicValidateTrigger) => {
      dynamicValidator.value = [validator, trigger];

      return () => {
        if (dynamicValidator.value?.[0] === validator) {
          dynamicValidator.value = undefined;
        }
      };
    };

    const rules = computed(() => {
      let values = typeof props.rules === 'function' ? props.rules(form.values, form) : props.rules;

      if (props.required) {
        values = toArray(values).slice(0);

        // 检查是否已经包含了 required 验证规则
        if (!values.some(i => i.required)) {
          values.unshift({
            required: true,
            message: props.requiredMessage || t('wkc.valueCannotBeNull', { label: takeString(props.label) }),
          });
        }
      }

      if (atom.value.validate) {
        // 原件内部验证器
        values = toArray(values).slice(0);
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

      // 动态规则
      if (dynamicValidator.value) {
        values = toArray(values).slice(0);
        const [validator, trigger] = dynamicValidator.value;

        values.push({
          async validator(_rule, val, callback) {
            try {
              await validator();
              callback();
            } catch (err) {
              // eslint-disable-next-line n/no-callback-literal
              callback(err as Error);
            }
          },
          trigger,
        });
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
      const widthProps = ['width', 'maxWidth', 'minWidth'] satisfies (keyof FatFormItemProps)[];
      const hasValueProps = widthProps.filter(key => props[key] !== undefined);
      if (hasValueProps.length > 0) {
        return hasValueProps.reduce<Record<(typeof widthProps)[number], string>>((obj, key) => {
          obj[key] = formItemWidth(props[key]!);
          return obj;
          // @ts-expect-error
        }, {});
      }

      return undefined;
    });

    const forceHideLabel = computed(() => {
      return !hasLabel.value && form.layout !== 'horizontal';
    });

    const labelWidth = computed(() => {
      // fix [ElementForm]unpected width
      // element-ui 下 如果当前 FormItem 的 hidden 为 true, 那么其内部获取不到对应的 label 的实际宽度 从而在销毁的时候报错
      if (hidden.value && (!props.labelWidth || props.labelWidth === 'auto')) {
        return '0px';
      }

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
          registerValidator: registerDynamicValidator,
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
                      <InquiryFill class="fat-form-tooltip" />
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
) => OurComponentInstance<typeof props, FatFormItemSlots<Store>, FatFormItemEvents<Store>, FatFormItemMethods<Store>>;
