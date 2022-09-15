import { Radio, RadioGroup, RadioGroupProps, model } from '@wakeadmin/element-adapter';
import { computed, unref } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export interface ARadioOption {
  value: any;
  label: any;
  disabled?: boolean;
}

export type ARadioProps = DefineAtomicProps<
  boolean,
  RadioGroupProps,
  {
    /**
     * 选项
     */
    options?: ARadioOption[];

    /**
     * 自定义预览渲染
     */
    renderPreview?: (option?: ARadioOption) => any;
  }
>;
declare global {
  interface AtomicProps {
    radio: ARadioProps;
  }
}

export const ARadioComponent = defineAtomicComponent(
  (props: ARadioProps) => {
    const configurable = useFatConfigurable();

    const active = computed(() => {
      return (props.options ?? NoopArray).find(i => i.value === props.value);
    });

    return () => {
      const { mode, scene, context, value, onChange, renderPreview, options, ...other } = props;

      if (mode === 'preview') {
        return renderPreview ? (
          renderPreview(active.value)
        ) : (
          <span>{active.value ? active.value.label : unref(configurable).undefinedPlaceholder}</span>
        );
      }

      return (
        <RadioGroup {...other} {...model(value, onChange!)}>
          {(options ?? NoopArray).map((i, idx) => {
            return (
              <Radio label={i.value} disabled={i.disabled} key={i.value ?? idx}>
                {i.label}
              </Radio>
            );
          })}
        </RadioGroup>
      );
    };
  },
  { name: 'ARadio', globalConfigKey: 'aRadioProps' }
);

export const ARadio = defineAtomic({
  name: 'radio',
  component: ARadioComponent,
  description: '单选框',
  author: 'ivan-lee',
});
