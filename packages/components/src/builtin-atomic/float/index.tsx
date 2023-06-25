import { InputNumberProps, InputNumber, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { trimEndingZero } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { toFloat } from '../../utils';

export type AFloatProps = DefineAtomicProps<
  number,
  InputNumberProps,
  {
    renderPreview?: (value?: number) => any;

    /**
     * 小数点精度, 默认为 2
     */
    precision?: number;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

declare global {
  interface AtomicProps {
    float: AFloatProps;
  }
}

export const AFloatComponent = defineAtomicComponent(
  (props: AFloatProps) => {
    const configurable = useFatConfigurable();
    const valueInNumber = computed(() => toFloat(props.value));

    return () => {
      const {
        value: _value,
        mode,
        onChange,
        renderPreview,
        undefinedPlaceholder,
        scene,
        context,
        precision = 2,
        ...other
      } = props;
      const value = valueInNumber.value;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {value != null
              ? trimEndingZero(value, precision)
              : undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return <InputNumber controlsPosition="right" precision={precision} {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'AFloat', globalConfigKey: 'aFloatProps' }
);

export const AFloat = defineAtomic({
  name: 'float',
  component: AFloatComponent,
  description: '浮点数输入',
  author: 'ivan-lee',
});

export const ANumber = defineAtomic({
  name: 'number',
  component: AFloatComponent,
  description: 'float 的别名',
  author: 'ivan-lee',
});
