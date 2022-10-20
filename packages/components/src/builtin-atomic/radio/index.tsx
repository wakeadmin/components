import { Radio, RadioGroup, RadioGroupProps, model, RadioButton } from '@wakeadmin/element-adapter';
import { computed, VNodeChild } from '@wakeadmin/demi';
import { NoopArray } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

export interface ARadioOption {
  value: any;
  label: VNodeChild | ((checked: boolean) => VNodeChild);
  disabled?: boolean;
}

export type ARadioValue = string | number;

export type ARadioProps = DefineAtomicProps<
  ARadioValue,
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

    /**
     * 是否为按钮形式, 默认 false
     */
    inButton?: boolean;
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
      const { mode, scene, context, value, onChange, renderPreview, options, inButton, ...other } = props;

      if (mode === 'preview') {
        return renderPreview ? (
          renderPreview(active.value)
        ) : (
          <span class={other.class} style={other.style}>
            {active.value
              ? typeof active.value.label === 'function'
                ? active.value.label(true)
                : active.value.label
              : configurable.undefinedPlaceholder}
          </span>
        );
      }

      const Child = inButton ? RadioButton : Radio;

      return (
        <RadioGroup {...other} {...model(value, onChange!)}>
          {(options ?? NoopArray).map((i, idx) => {
            return (
              <Child label={i.value} disabled={i.disabled} key={i.value ?? idx}>
                {typeof i.label !== 'function' ? i.label : i.label(active.value === i)}
              </Child>
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
