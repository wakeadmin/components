import { SwitchProps, Switch, model } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps, globalRegistry } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ASwitchProps = DefineAtomicProps<
  string | number | boolean,
  SwitchProps,
  {
    renderPreview?: (active: boolean) => any;
    /**
     * 默认同 activeText
     */
    previewActiveText?: string;
    /**
     * 预览时 inactiveText
     */
    previewInactiveText?: string;
  }
>;

declare global {
  interface AtomicProps {
    switch: ASwitchProps;
  }
}

// TODO：支持内联文本
export const ASwitchComponent = defineAtomicComponent((props: ASwitchProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, context, scene, renderPreview, ...other } = props;
    const passthrough = { ...unref(configurable).aSwitchProps, ...other };

    const activeValue = passthrough.activeValue ?? true;
    const active = value === activeValue;
    const activeText = passthrough.previewActiveText ?? passthrough.activeText ?? '开启';
    const inactiveText = passthrough.previewInactiveText ?? passthrough.inactiveText ?? '关闭';

    if (mode === 'preview') {
      return renderPreview ? renderPreview(active) : <span>{active ? activeText : inactiveText}</span>;
    }

    return <Switch {...passthrough} {...model(value, onChange!)} />;
  };
});

export const ASwitch = defineAtomic({
  name: 'switch',
  component: ASwitchComponent,
  description: '开关',
  author: 'ivan-lee',
});

globalRegistry.register('switch', ASwitch);
