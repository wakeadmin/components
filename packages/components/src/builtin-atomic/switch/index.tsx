import { SwitchProps, Switch, model } from '@wakeadmin/component-adapter';

import { AtomicCommonProps, defineAtomic, globalRegistry } from '../../atomic';

export type ASwitchProps = AtomicCommonProps<string | number | boolean> &
  Omit<SwitchProps, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue'>;

// TODO：支持内联文本
export const ASwitchComponent = (props: ASwitchProps) => {
  const { value, mode, onChange, context, scene, ...other } = props;

  const activeValue = other.activeValue ?? true;
  const active = value === activeValue;
  const activeText = other.activeText ?? '开启';
  const inactiveText = other.inactiveText ?? '关闭';

  if (mode === 'preview') {
    return active ? activeText : inactiveText;
  }

  return <Switch {...model(value, onChange!)} {...other} />;
};

declare global {
  interface AtomicProps {
    switch: ASwitchProps;
  }
}

export const ASwitch = defineAtomic({
  name: 'switch',
  component: ASwitchComponent,
  description: '开关',
  author: 'ivan-lee',
});

globalRegistry.register('switch', ASwitch);
