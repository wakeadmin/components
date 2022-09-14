import { SelectProps, Select, Option, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';

import { defineAtomic, globalRegistry, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName, normalizeStyle } from '../../utils';

import { useOptions } from './loader';
import { ASelectOption, normalizeColor } from './shared';

export type ASelectProps = DefineAtomicProps<
  string | number | boolean,
  SelectProps,
  {
    options?: ASelectOption[] | (() => Promise<ASelectOption[]>);

    renderPreview?: (active?: ASelectOption) => any;

    /**
     * 选项颜色的渲染模式，默认为 text
     */
    colorMode?: 'text' | 'dot';
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
      const { mode, value, renderPreview, onChange, context, scene, options: _, colorMode = 'text', ...other } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(active.value);
        }

        return (
          <span
            class={normalizeClassName(other.class, 'fat-a-select', 'fat-a-select--preview', {
              'fat-a-select--color': active.value?.color,
              'fat-a-select--color-dot': props.colorMode === 'dot',
            })}
            style={normalizeStyle(other.style, { '--fat-a-select-color': normalizeColor(active.value?.color) })}
          >
            {active.value?.label ?? configurable.undefinedPlaceholder}
          </span>
        );
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
