import { Checkbox, CheckboxGroup, CheckboxGroupProps, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { NoopArray, booleanPredicate } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export type ACheckboxsValue = any[];

export interface ACheckboxsOption {
  label: string;
  value: any;
  disabled?: boolean;
}

export type ACheckboxsProps = DefineAtomicProps<
  ACheckboxsValue,
  CheckboxGroupProps,
  {
    options?: ACheckboxsOption[];

    /**
     * 分隔符，默认', '
     */
    separator?: string;

    /**
     * 自定义预览
     */
    renderPreview?: (options: ACheckboxsOption[]) => any;
  }
>;

declare global {
  interface AtomicProps {
    checkboxs: ACheckboxsProps;
  }
}

export const ACheckboxsComponent = defineAtomicComponent(
  (props: ACheckboxsProps) => {
    const configurable = useFatConfigurable();
    const checkedOptions = computed(() => {
      const values = props.value ?? NoopArray;
      const options = props.options ?? NoopArray;

      return values
        .map(i => {
          return options.find(j => j.value === i);
        })
        .filter(booleanPredicate);
    });

    return () => {
      const {
        mode,
        scene,
        context,
        value,
        onChange,
        renderPreview,
        options = NoopArray,
        separator = ', ',
        ...other
      } = props;

      if (mode === 'preview') {
        return renderPreview ? (
          renderPreview(checkedOptions.value)
        ) : (
          <span class={other.class} style={other.style}>
            {checkedOptions.value.length
              ? checkedOptions.value.map(i => i.label).join(separator)
              : configurable.undefinedPlaceholder}
          </span>
        );
      }

      return (
        <CheckboxGroup {...other} {...model(value ?? NoopArray, onChange!)}>
          {options.map((i, idx) => {
            return (
              <Checkbox key={`${i.label}_${idx}`} label={i.value} disabled={i.disabled}>
                {i.label}
              </Checkbox>
            );
          })}
        </CheckboxGroup>
      );
    };
  },
  { name: 'ACheckboxs', globalConfigKey: 'aCheckboxsProps' }
);

export const ACheckboxs = defineAtomic({
  name: 'checkboxs',
  component: ACheckboxsComponent,
  description: '复选框',
  author: 'ivan-lee',
});
