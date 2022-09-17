import { FormItem, Col, Row, Tooltip, ColProps, CommonProps } from '@wakeadmin/element-adapter';
import { computed, provide, onBeforeUnmount } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { Inquiry } from '@wakeadmin/icons';

import { useFatConfigurable } from '../fat-configurable';
import { FatSpace, toNumberSize } from '../fat-space';
import { hasSlots, normalizeClassName, normalizeStyle, renderSlot, ToHSlotDefinition } from '../utils';

import { FatFormInheritanceContext } from './constants';
import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormGroupProps, FatFormGroupSlots, FatFormItemInheritableProps } from './types';
import { formItemWidth } from './utils';

const FatFormGroupInner = declareComponent({
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
    required: Boolean,
    vertical: Boolean,
    contentClassName: null,
    contentStyle: null,
    hideMessageOnPreview: { type: Boolean, default: undefined },

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
    const inherited = useInheritableProps();

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

    const inheritProps: FatFormItemInheritableProps = {
      get mode() {
        return props.mode ?? inherited?.mode;
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
      if (inheritProps.mode === 'preview' && (inheritProps.hideMessageOnPreview ?? true)) {
        return true;
      }
      return false;
    });

    provide(FatFormInheritanceContext, inheritProps);
    expose(instance);

    onBeforeUnmount(() => {
      form.__unregisterFormGroup(instance);
    });

    return () => {
      const gutter = props.gutter ?? configurable.fatForm?.groupGutter ?? 'large';
      const gutterInNumber = toNumberSize(gutter);
      const inlineMessage = form.layout === 'inline' || props.inlineMessage;
      const col = (props.col ?? inherited?.col) as (ColProps & Partial<CommonProps>) | undefined;

      let children = renderSlot(props, slots, 'default', form);

      if (props.row) {
        children = (
          <Row
            {...props.row}
            class={normalizeClassName('fat-form-row', props.row?.class)}
            style={props.row.style}
            gutter={props.row.gutter ?? gutterInNumber}
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
            align={form.layout === 'vertical' ? 'end' : undefined}
          >
            {children}
          </FatSpace>
        );
      }

      const labelSlot =
        hasTooltip.value || hasSlots(props, slots, 'label')
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

export const FatFormGroup = FatFormGroupInner as unknown as <S extends {} = any>(props: FatFormGroupProps<S>) => any;
