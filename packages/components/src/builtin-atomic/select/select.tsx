import { SelectProps, Select, Option, model, OptionProps } from '@wakeadmin/component-adapter';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, globalRegistry, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { useOptions } from './loader';

export type ASelectProps = DefineAtomicProps<
  string | number | boolean,
  SelectProps,
  {
    options?: OptionProps[] | (() => Promise<OptionProps[]>);
    renderPreview?: (active?: OptionProps) => any;
  }
>;

export const ASelectComponent = defineAtomicComponent(
  (props: ASelectProps) => {
    const { loading, options } = useOptions(props);
    const configurable = useFatConfigurable();

    const active = computed(() => {
      return options.value.find(i => i.value === props.value);
    });

    return () => {
      const { mode, value, renderPreview, onChange, context, scene, options: _, ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(active.value);
        }

        return <span>{active.value?.label ?? configurable.undefinedPlaceholder}</span>;
      }

      return (
        <Select loading={loading.value} {...other} {...model(value, onChange!)}>
          {options.value.map((i, idx) => {
            return <Option key={i.value ?? idx} {...i}></Option>;
          })}
        </Select>
      );
    };
  },
  { name: 'ASelect', globalConfigKey: 'aSelectProps' }
);

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
