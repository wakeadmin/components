import { SelectProps, Select, Option, model, vLoading } from '@wakeadmin/element-adapter';
import { withDirectives } from '@wakeadmin/h';
import { computed, watchEffect } from '@wakeadmin/demi';
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
     * 是否需要验证 value 必须在 options 中, 默认 false
     */
    requiredValueOnOptions?: boolean;

    /**
     * requiredValueOnOptions 验证失败时的错误信息，默认为 placeholder 的值
     */
    requiredValueOnOptionsMessage?: string;

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

    const placeholder = computed(() => {
      return getOrCreatePlaceholder('multi-select', props);
    });

    watchEffect(onClean => {
      const { requiredValueOnOptions, context } = props;

      if (requiredValueOnOptions) {
        const disposer = context?.registerValidator?.(async () => {
          const { value, requiredValueOnOptionsMessage } = props;

          if (value == null || value.length === 0) {
            return;
          }

          const opts = options.value || NoopArray;
          for (const item of value) {
            const existed = opts.some(i => i.value === item);
            if (!existed) {
              throw new Error(requiredValueOnOptionsMessage ?? placeholder.value);
            }
          }
        });

        if (disposer) {
          onClean(disposer);
        }
      }
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
          // 垃圾 element-ui loading 没有效果
          {...withDirectives([[vLoading, loading.value]])}
          disabled={loading.value}
          loading={loading.value}
          multiple
          {...other}
          {...model(value, onChange!)}
          placeholder={placeholder.value}
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
