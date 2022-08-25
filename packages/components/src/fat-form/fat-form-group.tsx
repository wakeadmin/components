import { FormItem, Col, Row, Tooltip } from '@wakeadmin/component-adapter';
import { computed, provide } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { Inquiry } from '@wakeadmin/icons';

import { FatSpace, toNumberSize } from '../fat-space';
import { hasSlots, normalizeClassName, normalizeStyle, renderSlot, ToHSlotDefinition } from '../utils';

import { FatFormInheritanceContext } from './constants';
import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormGroupProps, FatFormGroupSlots, FatFormItemInheritableProps } from './types';
import { formItemWidth } from './utils';

const FatFormGroupInner = declareComponent({
  name: 'FatFormGroup',
  props: declareProps<FatFormGroupProps<any>>([
    'mode',
    'label',
    'labelWidth',
    'tooltip',
    'message',
    'inlineMessage',
    'col',
    'width',
    'size',
    'gutter',
    'row',
    'hidden',
    'disabled',
    'required',
    'contentClassName',
    'contentStyle',

    // slots
    'renderLabel',
    'renderDefault',
    'renderMessage',
    'renderTooltip',
  ]),
  slots: declareSlots<ToHSlotDefinition<FatFormGroupSlots<any>>>(),
  setup(props, { slots, attrs }) {
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
      get disabled() {
        return disabled.value;
      },
      get hidden() {
        return hidden.value;
      },
    };

    // TODO: 以下重复内容可以提取到 hooks 中
    const hasLabel = computed(() => {
      return !!(props.label || !!props.renderLabel || !!slots.label);
    });

    const hasTooltip = computed(() => {
      return props.tooltip || props.renderTooltip || slots.tooltip;
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

    provide(FatFormInheritanceContext, inheritProps);

    return () => {
      const gutter = props.gutter ?? 'large';
      const gutterInNumber = toNumberSize(gutter);
      const inlineMessage = form.layout === 'inline' || props.inlineMessage;

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
            size={gutter}
            wrap
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

      let node = (
        <FormItem
          // attrs.class 需要注入到根节点
          class={normalizeClassName(
            'fat-form-group',
            { 'fat-form-item--hide-label': forceHideLabel.value },
            props.col ? undefined : attrs.class
          )}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, props.col ? undefined : attrs.style)}
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
            {(props.message || hasSlots(props, slots, 'message')) && (
              <div class={normalizeClassName('fat-form-message', { 'fat-form-message--inline': inlineMessage })}>
                {hasSlots(props, slots, 'message') ? renderSlot(props, slots, 'message', form) : props.message}
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

export const FatFormGroup = FatFormGroupInner as unknown as <S extends {} = any>(props: FatFormGroupProps<S>) => any;
