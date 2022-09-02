import { SelectProps, Select, Option, model, OptionProps } from '@wakeadmin/component-adapter';
import { computed, unref } from '@wakeadmin/demi';
import { booleanPredicate, NoopArray } from '@wakeadmin/utils';

import { AtomicCommonProps, defineAtomic, globalRegistry, defineAtomicComponent } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { useOptions } from './loader';

export type AMultiSelectValue = (string | number | boolean)[];

export type AMultiSelectProps = AtomicCommonProps<AMultiSelectValue> &
  Omit<SelectProps, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue' | 'multiple'> & {
    options?: OptionProps[] | (() => Promise<OptionProps[]>);
    /**
     * 分隔符，默认', '
     */
    separator?: string;

    /**
     * 自定义预览渲染
     */
    renderPreview?: (options: OptionProps[]) => any;
  };

export const AMultiSelectComponent = defineAtomicComponent((props: AMultiSelectProps) => {
  const { loading, options } = useOptions(props);
  const configurableRef = useFatConfigurable();

  const active = computed(() => {
    const value = props.value ?? NoopArray;
    return value.map(i => options.value.find(j => j.value === i)).filter(booleanPredicate);
  });

  return () => {
    const { mode, value, onChange, ...other } = props;
    const configurable = unref(configurableRef);

    if (mode === 'preview') {
      return (
        <span>
          {props.renderPreview
            ? props.renderPreview(active.value)
            : active.value.length
            ? active.value.map(i => i.label).join(props.separator ?? ', ')
            : configurable.undefinedPlaceholder}
        </span>
      );
    }

    return (
      <Select
        {...model(value, onChange!)}
        loading={loading.value}
        placeholder={props.placeholder ?? '请选择'}
        {...other}
        multiple
      >
        {options.value.map((i, idx) => {
          return <Option key={i.value ?? idx} {...i}></Option>;
        })}
      </Select>
    );
  };
}, 'AMultiSelect');

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

globalRegistry.register('multi-select', AMultiSelect);
