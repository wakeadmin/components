import { SwitchProps, Switch, useVModel } from '@wakeadmin/element-adapter';
import { ref } from '@wakeadmin/demi';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

export type ASwitchValue = string | number | boolean;

export type ASwitchProps = DefineAtomicProps<
  ASwitchValue,
  Omit<SwitchProps, 'beforeChange'>,
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

    /**
     * switch 状态改变前的钩子， 返回 false 或者返回 Promise 且被 reject 则停止切换
     *
     * 如果返回的是 Promise，switch 原件将会帮你维护 loading 状态
     */
    beforeChange?: (value?: ASwitchValue) => Promise<boolean> | boolean;
  }
>;

declare global {
  interface AtomicProps {
    switch: ASwitchProps;
  }
}

export const ASwitchComponent = defineAtomicComponent(
  (props: ASwitchProps) => {
    const vmodel = useVModel(props);

    const loading = ref(false);

    const handleBeforeChange = async () => {
      if (props.beforeChange == null) {
        return true;
      }

      try {
        loading.value = true;
        return await props.beforeChange(props.value);
      } finally {
        loading.value = false;
      }
    };

    return () => {
      const { value, mode, onChange, context, scene, renderPreview, beforeChange: _beforeChange, ...other } = props;

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

      return <Switch loading={loading.value} beforeChange={handleBeforeChange} {...other} {...vmodel.value} />;
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
