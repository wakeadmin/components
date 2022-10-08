import { Checkbox, CheckboxProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

export type ACheckboxProps = DefineAtomicProps<
  boolean,
  CheckboxProps,
  {
    /**
     * 标签
     */
    label?: string;

    /**
     * 自定义标签渲染
     */
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

export const ACheckboxComponent = defineAtomicComponent(
  (props: ACheckboxProps) => {
    return () => {
      const { mode, scene, context, value, onChange, renderPreview, renderLabel, label, ...other } = props;
      const checked = !!value;

      const labelContent = renderLabel ? renderLabel(checked) : label;
      if (mode === 'preview') {
        const checkedText = other.previewActiveText ?? '开启';
        const uncheckedText = other.previewInactiveText ?? '关闭';

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
        <Checkbox {...other} {...model(value, onChange!)}>
          {labelContent}
        </Checkbox>
      );
    };
  },
  { name: 'ACheckbox', globalConfigKey: 'aCheckboxProps' }
);

export const ACheckbox = defineAtomic({
  name: 'checkbox',
  component: ACheckboxComponent,
  description: '复选开关',
  author: 'ivan-lee',
});
