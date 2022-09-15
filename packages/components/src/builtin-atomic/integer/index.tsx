import { InputNumberProps, InputNumber, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

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

export const AIntegerComponent = defineAtomicComponent(
  (props: AIntegerProps) => {
    return () => {
      const { value, mode, onChange, renderPreview, scene, context, ...other } = props;

      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {renderPreview ? renderPreview(value) : value ? String(value) : ''}
        </span>
      ) : (
        <InputNumber precision={0} {...other} {...model(value, onChange!)} />
      );
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
