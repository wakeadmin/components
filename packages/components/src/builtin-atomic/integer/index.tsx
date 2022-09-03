import { InputNumberProps, InputNumber, model } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type AIntegerProps = DefineAtomicProps<
  number,
  InputNumberProps,
  {
    renderPreview?: (value?: number) => any;
  }
>;

declare global {
  interface AtomicProps {
    integer: AIntegerProps;
  }
}

export const AIntegerComponent = defineAtomicComponent((props: AIntegerProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, renderPreview, scene, context, ...other } = props;

    return mode === 'preview' ? (
      <span class={other.class} style={other.style}>
        {renderPreview ? renderPreview(value) : value ? String(value) : ''}
      </span>
    ) : (
      <InputNumber precision={0} {...unref(configurable).aIntegerProps} {...other} {...model(value, onChange!)} />
    );
  };
}, 'AInteger');

export const AInteger = defineAtomic({
  name: 'integer',
  component: AIntegerComponent,
  description: '整数输入',
  author: 'ivan-lee',
});

globalRegistry.register('integer', AInteger);
