import { InputNumberProps, InputNumber, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { toInt } from '../../utils';

export type AIntegerProps = DefineAtomicProps<
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
    integer: AIntegerProps;
  }
}

export const AIntegerComponent = defineAtomicComponent(
  (props: AIntegerProps) => {
    const configurable = useFatConfigurable();
    const valueInNumber = computed(() => toInt(props.value));

    return () => {
      const {
        value: _ignoreValue,
        mode,
        onChange,
        renderPreview,
        scene,
        context,
        undefinedPlaceholder,
        ...other
      } = props;
      const value = valueInNumber.value;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        return (
          <span class={other.class} style={other.style}>
            {value ?? undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </span>
        );
      }

      return <InputNumber controlsPosition="right" precision={0} {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'AInteger', globalConfigKey: 'aIntegerProps' }
);

export const AInteger = defineAtomic({
  name: 'integer',
  component: AIntegerComponent,
  description: '整数输入',
  author: 'ivan-lee',
});
