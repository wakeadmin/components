import { Checkbox, CheckboxProps, model } from '@wakeadmin/component-adapter';

import { defineAtomic, globalRegistry, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ACheckboxProps = DefineAtomicProps<
  boolean,
  CheckboxProps,
  {
    label?: string;
    renderLabel?: (value: boolean) => any;

    /**
     * 自定义渲染预览
     */
    renderPreview?: (value: boolean, label: any) => any;

    /**
     * 选中时预览文案，默认为 '开启'
     */
    previewActiveText?: string;
    /**
     * 选中时预览文案，默认为 '关闭'
     */
    previewInactiveText?: string;
  }
>;

declare global {
  interface AtomicProps {
    checkbox: ACheckboxProps;
  }
}

export const ACheckboxComponent = defineAtomicComponent((props: ACheckboxProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { mode, scene, context, value, onChange, renderPreview, renderLabel, label, ...other } = props;
    const passthrough = { ...configurable.aCheckboxProps, ...other };
    const checked = !!value;

    const labelContent = renderLabel ? renderLabel(checked) : label;
    if (mode === 'preview') {
      const checkedText = passthrough.previewActiveText ?? '开启';
      const uncheckedText = passthrough.previewInactiveText ?? '关闭';

      return renderPreview ? (
        renderPreview(checked, labelContent)
      ) : (
        <span>
          {checked ? checkedText : uncheckedText}
          {labelContent}
        </span>
      );
    }

    return (
      <Checkbox {...passthrough} {...model(value, onChange!)}>
        {labelContent}
      </Checkbox>
    );
  };
});

export const ACheckbox = defineAtomic({
  name: 'checkbox',
  component: ACheckboxComponent,
  description: '复选开关',
  author: 'ivan-lee',
});

globalRegistry.register('checkbox', ACheckbox);
