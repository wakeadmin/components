import { InputNumberProps, InputNumber, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { toFloat } from '../../utils';

export type ANumberProps = DefineAtomicProps<
  number,
  InputNumberProps,
  {
    renderPreview?: (value?: number) => any;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  }
>;

declare global {
  interface AtomicProps {
    number: ANumberProps;
  }
}

export const ANumberComponent = defineAtomicComponent(
  (props: ANumberProps) => {
    const configurable = useFatConfigurable();
    const valueInNumber = computed(() => toFloat(props.value));

    return () => {
      const { value: _value, mode, onChange, renderPreview, undefinedPlaceholder, scene, context, ...other } = props;
      const value = valueInNumber.value;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {value != null ? value : undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return <InputNumber controlsPosition="right" {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ANumber', globalConfigKey: 'aNumberProps' }
);

export const ANumber = defineAtomic({
  name: 'number',
  component: ANumberComponent,
  description: '数字输入',
  author: 'ivan-lee',
});
