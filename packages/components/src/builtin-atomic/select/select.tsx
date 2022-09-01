import { SelectProps, Select, Option, model, OptionProps } from '@wakeadmin/component-adapter';
import { computed } from '@wakeadmin/demi';

import { AtomicCommonProps, defineAtomic, globalRegistry, defineAtomicComponent } from '../../atomic';
import { UNDEFINED_PLACEHOLDER } from '../../constants';
import { useOptions } from './loader';

export type ASelectProps = AtomicCommonProps<string | number | boolean> &
  Omit<SelectProps, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue' | 'multiple'> & {
    options?: OptionProps[] | (() => Promise<OptionProps[]>);
  };

export const ASelectComponent = defineAtomicComponent((props: ASelectProps) => {
  const { loading, options } = useOptions(props);

  const active = computed(() => {
    return options.value.find(i => i.value === props.value);
  });

  return () => {
    const { mode, value, onChange, ...other } = props;

    if (mode === 'preview') {
      return <span>{active.value?.label ?? UNDEFINED_PLACEHOLDER}</span>;
    }

    return (
      <Select
        {...model(value, onChange!)}
        placeholder={props.placeholder ?? '请选择'}
        loading={loading.value}
        {...other}
      >
        {options.value.map((i, idx) => {
          return <Option key={i.value ?? idx} {...i}></Option>;
        })}
      </Select>
    );
  };
}, 'ASelect');

declare global {
  interface AtomicProps {
    select: ASelectProps;
  }
}

export const ASelect = defineAtomic({
  name: 'select',
  component: ASelectComponent,
  description: '下拉选择器',
  author: 'ivan-lee',
});

globalRegistry.register('select', ASelect);
