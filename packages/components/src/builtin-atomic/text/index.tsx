import { InputProps, Input, model } from '@wakeadmin/component-adapter';

import { globalRegistry, AtomicCommonProps, defineAtomic } from '../../atomic';

export type AInputProps = AtomicCommonProps<string> & Omit<InputProps, 'value' | 'onChange' | 'disabled'>;

export const ATextComponent = (props: AInputProps) => {
  const { value, mode, onChange, ...other } = props;
  return mode === 'preview' ? (
    <span class={other.class} style={other.style}>
      {value ? String(value) : ''}
    </span>
  ) : (
    <Input {...model(value, onChange!)} {...other} />
  );
};

declare global {
  interface AtomicProps {
    input: AInputProps;
  }
}

export const AText = defineAtomic({
  name: 'text',
  component: ATextComponent,
  description: '文本输入',
  author: 'ivan-lee',
});

globalRegistry.register('text', AText);
