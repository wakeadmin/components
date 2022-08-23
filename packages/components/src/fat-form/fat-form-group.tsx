import { FormItem, Col, Row } from '@wakeadmin/component-adapter';
import { computed, provide } from '@wakeadmin/demi';
import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';

import { FatSpace, toNumberSize } from '../fat-space';
import { hasSlots, normalizeClassName, normalizeStyle, renderSlot, ToHSlotDefinition } from '../utils';

import { FatFormInheritanceContext } from './constants';
import { useFatFormContext, useInheritableProps } from './hooks';
import { FatFormGroupProps, FatFormGroupSlots, FatFormItemInheritableProps } from './types';

const FatFormGroupInner = declareComponent({
  name: 'FatFormGroup',
  props: declareProps<FatFormGroupProps<any>>([
    'mode',
    'label',
    'labelWidth',
    'tooltip',
    'message',
    'col',
    'width',
    'size',
    'gutter',
    'row',
    'hidden',
    'disabled',
    'required',

    // slots
    'renderLabel',
    'renderDefault',
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

    const hasLabel = computed(() => {
      return !!(props.label || !!props.renderLabel || !!slots.label);
    });

    provide(FatFormInheritanceContext, inheritProps);

    return () => {
      const gutter = props.gutter ?? 'huge';
      const gutterInNumber = toNumberSize(gutter);

      let children = renderSlot(props, slots, 'default');

      if (props.row) {
        children = (
          <Row
            {...props.row}
            class={normalizeClassName('fat-form-row', props.row?.class)}
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
            class="fat-form-group-container"
            inline={false}
            align={form.layout === 'vertical' ? 'end' : undefined}
          >
            {children}
          </FatSpace>
        );
      }

      // 这里要修复一下 element-ui / element-plus 对 label 的处理的一些区别
      const labelSlot = hasSlots(props, slots, 'label')
        ? { label: renderSlot(props, slots, 'label') }
        : // 显式定义了 labelWidth auto, 需要加上 label 占位符
        !hasLabel.value && props.labelWidth !== undefined
        ? { label: <span /> }
        : undefined;

      let node = (
        <FormItem
          // attrs.class 需要注入到根节点
          class={normalizeClassName('fat-form-group', props.col ? undefined : attrs.class)}
          style={normalizeStyle({ display: hidden.value ? 'none' : undefined }, props.col ? undefined : attrs.style)}
          label={props.label}
          // element-plus labelWidth auto 情况下，嵌套 form item 使用会创建 label，所以当没有 label 时这里显式设置为 0
          labelWidth={props.labelWidth ?? (hasLabel.value ? undefined : '0px')}
          size={inheritProps.size}
          required={props.required}
          v-slots={labelSlot}
        >
          {children}
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
