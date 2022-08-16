import { InputProps, Input, model } from '@wakeadmin/component-adapter';

import { globalRegistry, AtomicCommonProps } from '../../atomic';

import { AText } from '../text';

export type AInputProps = AtomicCommonProps<string> & Omit<InputProps, 'value' | 'onChange' | 'disabled'>;

const AInput = (props: AInputProps) => {
  const { value, mode, onChange, ...other } = props;
  return mode === 'preview' ? AText(props) : <Input {...model(value, onChange!)} {...other} />;
};

declare global {
  interface AtomicProps {
    input: AInputProps;
  }
}

globalRegistry.register('input', {
  name: 'input',
  component: AInput,
  description: '文本输入',
  author: 'ivan-lee',
});
