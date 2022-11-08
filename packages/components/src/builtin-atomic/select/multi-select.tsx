import { SelectProps, Select, Option, model } from '@wakeadmin/element-adapter';
import { computed } from '@wakeadmin/demi';
import { booleanPredicate, NoopArray } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

import { useOptions } from './loader';
import { ASelectOption } from './shared';
import { getOrCreatePlaceholder } from '../../utils/placeholder';

export type AMultiSelectValue = (string | number)[];

export type AMultiSelectProps = DefineAtomicProps<
  AMultiSelectValue,
  SelectProps,
  {
    /**
     * 注意，异步加载函数会在组件启动时执行，后面的变更不会被处理
     */
    options?: ASelectOption[] | (() => Promise<ASelectOption[]>);
    /**
     * 分隔符，默认', '
     */
    separator?: string;

    /**
     * 自定义预览渲染
     */
    renderPreview?: (options: ASelectOption[]) => any;
  }
>;

export const AMultiSelectComponent = defineAtomicComponent(
  (props: AMultiSelectProps) => {
    const { loading, options } = useOptions(props);
    const configurable = useFatConfigurable();

    const active = computed(() => {
      const value = props.value ?? NoopArray;
      return value.map(i => options.value.find(j => j.value === i)).filter(booleanPredicate);
    });

    return () => {
      const { mode, value, onChange, context, scene, renderPreview, options: _, placeholder: __, ...other } = props;
      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(active.value);
        }

        return (
          <span class={other.class} style={other.style}>
            {active.value.length
              ? active.value.map(i => i.label).join(props.separator ?? ', ')
              : configurable.undefinedPlaceholder}
          </span>
        );
      }

      return (
        <Select
          loading={loading.value}
          multiple
          {...other}
          {...model(value, onChange!)}
          placeholder={getOrCreatePlaceholder('multi-select', props)}
        >
          {options.value.map((i, idx) => {
            return <Option key={i.value ?? idx} {...i}></Option>;
          })}
        </Select>
      );
    };
  },
  { name: 'AMultiSelect', globalConfigKey: 'aMultiSelectProps' }
);

declare global {
  interface AtomicProps {
    'multi-select': AMultiSelectProps;
  }
}

export const AMultiSelect = defineAtomic({
  name: 'multi-select',
  component: AMultiSelectComponent,
  description: '多选下拉选择器',
  author: 'ivan-lee',
});
