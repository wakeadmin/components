import { VNodeChild, computed } from '@wakeadmin/demi';
import { Checkbox, CheckboxProps, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useT } from '../../hooks';

export type ACheckboxProps = DefineAtomicProps<
  boolean,
  Omit<CheckboxProps, 'label'>,
  {
    /**
     * 标签
     */
    label?: VNodeChild | ((active: boolean) => VNodeChild);

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
    const labelContent = computed(() => {
      const checked = !!props.value;

      return typeof props.label === 'function' ? props.label(checked) : props.label;
    });

    const t = useT();

    return () => {
      const { mode, scene, context, value, onChange, renderPreview, label, ...other } = props;
      const checked = !!value;

      if (mode === 'preview') {
        const checkedText = other.previewActiveText ?? t('wkc.on');
        const uncheckedText = other.previewInactiveText ?? t('wkc.off');

        return renderPreview ? (
          renderPreview(checked, labelContent.value)
        ) : (
          <span class={other.class} style={other.style}>
            {checked ? checkedText : uncheckedText}
            {labelContent.value}
          </span>
        );
      }

      return (
        <Checkbox {...other} {...model(value, onChange!)}>
          {labelContent.value}
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
