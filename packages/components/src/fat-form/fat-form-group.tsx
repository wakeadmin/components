import { FormItem, Col, Row, RowProps, Tooltip, ColProps, CommonProps } from '@wakeadmin/element-adapter';
import { computed, provide, onBeforeUnmount, watch } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { Inquiry } from '@wakeadmin/icons';
import { NoopObject, equal, debounce } from '@wakeadmin/utils';

import { useFatConfigurable } from '../fat-configurable';
import { FatSpace, toNumberSize } from '../fat-space';
import {
  extraPropsFromChildren,
  hasSlots,
  normalizeClassName,
  normalizeStyle,
  renderSlot,
  ToHSlotDefinition,
  takeString,
  toArray,
} from '../utils';

import { FatFormInheritanceContext } from './constants';
import { useFatFormCollection, useFatFormContext, useInheritableProps } from './hooks';
import { FatFormGroupProps, FatFormGroupSlots, FatFormItemInheritableProps } from './types';
import { formItemWidth, isInModifyContext } from './utils';

const DEFAULT_ROW: RowProps & CommonProps = NoopObject;

export const FatFormGroup = declareComponent({
  name: 'FatFormGroup',
  props: declareProps<FatFormGroupProps<any>>({
    mode: null,
    label: null,
    labelWidth: null,
    tooltip: null,
    message: null,
    inlineMessage: { type: Boolean, default: false },
    col: null,
    width: null,
    size: null,
    gutter: null,
    row: null,
    hidden: { type: [Boolean, Function] as any, default: undefined },
    disabled: { type: [Boolean, Function] as any, default: undefined },
    clearable: { type: Boolean, default: undefined },
    preserve: { type: Boolean, default: undefined },
    prop: null,
    initialValue: null,
    required: Boolean,
    vertical: Boolean,
    dependencies: null,
    rules: null,
    contentClassName: null,
    contentStyle: null,
    hideMessageOnPreview: { type: Boolean, default: undefined },
    hideOnPreview: { type: Boolean, default: undefined },
    hideOnEdit: { type: Boolean, default: undefined },
    spaceProps: null,
    bareness: Boolean,

    // slots
    renderLabel: null,
    renderDefault: null,
    renderMessage: null,
    renderTooltip: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormGroupSlots<any>>>(),
  setup(props, { slots, attrs, expose }) {
    const configurable = useFatConfigurable();
    const form = useFatFormContext()!;
    const collection = useFatFormCollection();
    const inherited = useInheritableProps();

    // 初始化数据
    if (props.prop) {
      if (props.initialValue !== undefined) {
        form.__setInitialValue(props.prop, props.initialValue);
      }

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
    }

    const mode = computed(() => {
      return props.mode ?? inherited?.mode;
    });

    const disabled = computed(() => {
      let d: boolean | undefined;
      if (typeof props.disabled === 'function') {
        d = props.disabled(form);
      } else {
        d = props.disabled;
      }

      return d ?? inherited?.disabled;
    });

    const hidden = computed(() => {
      let h: boolean | undefined;
      if (typeof props.hidden === 'function') {
        h = props.hidden(form);
      } else {
        h = props.hidden;
      }

      return h ?? inherited?.hidden;
    });

    const alive = computed(() => {
      if (mode.value === 'preview') {
        if (props.hideOnPreview) {
          return false;
        }
      } else {
        if (props.hideOnEdit) {
          return false;
        }
      }

      return true;
    });

    /**
     * 是否开启字段验证
     */
    const validateEnabled = computed(() => {
      return !!props.prop && !hidden.value && !disabled.value && mode.value !== 'preview';
    });

    const rules = computed(() => {
      if (props.prop == null) {
        return undefined;
      }

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

      return values;
    });

    const inheritProps: FatFormItemInheritableProps = {
      get mode() {
        return mode.value;
      },
      get size() {
        return props.size ?? inherited?.size;
      },
      get clearable() {
        return props.clearable ?? inherited?.clearable;
      },
      get disabled() {
        return disabled.value;
      },
      get hidden() {
        return hidden.value;
      },
      get preserve() {
        return props.preserve ?? inherited?.preserve;
      },
      get hideMessageOnPreview() {
        return props.hideMessageOnPreview ?? inherited?.hideMessageOnPreview;
      },
      get col() {
        return inherited?.col;
      },
    };

    const instance = {
      get preserve() {
        return inheritProps.preserve;
      },
      get prop() {
        return props.prop;
      },
      async validate() {
        if (props.prop) {
          return await form.validateField(props.prop);
        }

        return true;
      },
    };

    // TODO: 以下重复内容可以提取到 hooks 中
    const hasLabel = computed(() => {
      return !!(props.label || !!props.renderLabel || !!slots.label);
    });

    const hasTooltip = computed(() => {
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      return props.tooltip || props.renderTooltip || slots.tooltip;
    });

    const contentStyle = computed(() => {
      if (props.width !== undefined) {
        return { maxWidth: formItemWidth(props.width) };
      }

      return undefined;
    });

    const normalizedCol = computed<(ColProps & CommonProps) | undefined>(() => {
      const val = props.col ?? inherited?.col;

      if (!val) {
        return undefined;
      }

      if (typeof val === 'number') {
        return { span: val } as ColProps;
      }

      return val;
    });

    const normalizedRow = computed<(RowProps & CommonProps) | undefined>(() => {
      if (!props.row) {
        return undefined;
      }

      if (typeof props.row === 'boolean') {
        return DEFAULT_ROW;
      }

      return props.row;
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

    const hideMessage = computed(() => {
      if (mode.value === 'preview' && (inheritProps.hideMessageOnPreview ?? true)) {
        return true;
      }
      return false;
    });

    provide(FatFormInheritanceContext, inheritProps);
    expose(instance);

    // 支持验证的分组
    const disposeCollection = props.prop ? collection?.registerItem(instance) : undefined;

    if (props.prop) {
      const debounceValidate = debounce(() => {
        instance.validate();
      }, 500);
      // 监听 dependencies 重新进行验证
      watch(
        (): any[] | undefined => {
          if (props.dependencies == null) {
            return;
          }

          const paths = Array.isArray(props.dependencies) ? props.dependencies : [props.dependencies];

          // eslint-disable-next-line consistent-return
          return paths.map(p => {
            return form.getFieldValue(p);
          });
        },
        values => {
          // touched 状态下才验证
          if (values == null || !validateEnabled.value) {
            return;
          }

          // 验证自身
          debounceValidate();
        }
      );

      // 通知表单移除验证状态
      watch(
        () => validateEnabled.value,
        enabled => {
          if (!enabled) {
            form.clearValidate(props.prop);
          }
        }
      );

      // 在分组中使用验证规则时, 无法通过 change 事件来触发验证，所以需要手动监听
      watch(
        () => form.getFieldValue(props.prop!),
        () => {
          if (validateEnabled.value && isInModifyContext()) {
            debounceValidate();
          }
        },
        {
          deep: true,
          // 同步监听，这个主要为了判断是否在 modify context 下
          flush: 'sync',
        }
      );
    }

    onBeforeUnmount(() => {
      form.__unregisterFormGroup(instance);
      disposeCollection?.();
    });

    return () => {
      if (!alive.value) {
        return null;
      }

      const gutter = props.gutter ?? configurable.fatForm?.groupGutter ?? (props.vertical ? 'sm' : 'xs');
      const gutterInNumber = toNumberSize(gutter);
      const inlineMessage = form.layout === 'inline' || props.inlineMessage;
      const col = normalizedCol.value;
      let row = normalizedRow.value;

      let children = renderSlot(props, slots, 'default', form);

      if (!row && extraPropsFromChildren(children)?.some(i => i && 'col' in i)) {
        // 检测子节点是否配置了网格
        row = DEFAULT_ROW;
      }

      if (props.bareness) {
        // do not wrap
      } else if (row) {
        children = (
          <Row
            {...row}
            class={normalizeClassName('fat-form-row', row?.class)}
            style={row.style}
            gutter={row.gutter ?? gutterInNumber}
          >
            {children}
          </Row>
        );
      } else {
        children = (
          <FatSpace
            size={gutterInNumber}
            wrap
            direction={props.vertical ? 'vertical' : 'horizontal'}
            class={normalizeClassName('fat-form-group-container')}
            inline={false}
            align="start"
            {...props.spaceProps}
          >
            {children}
          </FatSpace>
        );
      }

      const labelSlot =
        hasTooltip.value || hasLabel.value
          ? {
              label: (
                <span>
                  {renderSlot(props, slots, 'label', form)}
                  {props.label}
                  {!!hasTooltip.value && (
                    <Tooltip
                      v-slots={{
                        content: hasSlots(props, slots, 'tooltip')
                          ? renderSlot(props, slots, 'tooltip', form)
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
          {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message', form) : props.message}
        </div>
      );

      let node = (
        <FormItem
          // attrs.class 需要注入到根节点
          class={normalizeClassName(
            'fat-form-group',
            { 'fat-form-item--hide-label': forceHideLabel.value },
            col ? undefined : attrs.class
          )}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, col ? undefined : attrs.style)}
          label={props.label}
          labelWidth={labelWidth.value}
          size={inheritProps.size}
          required={props.required}
          prop={props.prop}
          rules={validateEnabled.value ? rules.value : undefined}
          v-slots={labelSlot}
        >
          <div
            class={normalizeClassName('fat-form-item__content', props.contentClassName, {
              'fat-form-item--inline-message': inlineMessage,
            })}
            style={normalizeStyle(contentStyle.value, props.contentStyle)}
          >
            {children}
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
