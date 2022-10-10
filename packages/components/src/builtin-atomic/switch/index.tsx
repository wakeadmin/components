import { SwitchProps, Switch, useVModel } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

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
export const ASwitchComponent = defineAtomicComponent(
  (props: ASwitchProps) => {
    const vmodel = useVModel(props);

    return () => {
      const { value, mode, onChange, context, scene, renderPreview, ...other } = props;

      const activeValue = other.activeValue ?? true;
      const active = value === activeValue;
      const activeText = other.previewActiveText ?? other.activeText ?? '开启';
      const inactiveText = other.previewInactiveText ?? other.inactiveText ?? '关闭';

      if (mode === 'preview') {
        return renderPreview ? (
          renderPreview(active)
        ) : (
          <span class={other.class} style={other.style}>
            {active ? activeText : inactiveText}
          </span>
        );
      }

      return <Switch {...other} {...vmodel.value} />;
    };
  },
  { name: 'ASwitch', globalConfigKey: 'aSwitchProps' }
);

export const ASwitch = defineAtomic({
  name: 'switch',
  component: ASwitchComponent,
  description: '开关',
  author: 'ivan-lee',
});
