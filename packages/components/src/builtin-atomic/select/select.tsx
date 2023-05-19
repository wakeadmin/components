import { SelectProps, Select, Option, model, vLoading } from '@wakeadmin/element-adapter';
import { computed, watchEffect } from '@wakeadmin/demi';
import { withDirectives } from '@wakeadmin/h';
import { NoopArray } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName, normalizeStyle } from '../../utils';

import { useOptions } from './loader';
import { ASelectOption, normalizeColor } from './shared';
import { getOrCreatePlaceholder } from '../../utils/placeholder';

export type ASelectValue = string | number;

export type ASelectProps = DefineAtomicProps<
  string | number,
  SelectProps,
  {
    /**
     * 注意，异步加载函数会在组件启动时执行，后面的变更不会被处理
     */
    options?: ASelectOption[] | (() => Promise<ASelectOption[]>);

    renderPreview?: (active?: ASelectOption) => any;

    /**
     * 是否需要验证 value 必须在 options 中, 默认 false
     */
    requiredValueOnOptions?: boolean;

    /**
     * requiredValueOnOptions 验证失败时的错误信息，默认为 placeholder 的值
     */
    requiredValueOnOptionsMessage?: string;

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

    const placeholder = computed(() => {
      return getOrCreatePlaceholder('select', props);
    });

    watchEffect(onClean => {
      const { requiredValueOnOptions, context } = props;

      if (requiredValueOnOptions) {
        const disposer = context?.registerValidator?.(async () => {
          const { value, requiredValueOnOptionsMessage } = props;

          if (value == null) {
            return;
          }

          const existed = (options.value || NoopArray).some(i => i.value === value);
          if (!existed) {
            throw new Error(requiredValueOnOptionsMessage ?? placeholder.value);
          }
        });

        if (disposer) {
          onClean(disposer);
        }
      }
    });

    return () => {
      const {
        mode,
        value,
        renderPreview,
        onChange,
        context,
        scene,
        options: _,
        placeholder: __,
        requiredValueOnOptions: ___,
        requiredValueOnOptionsMessage: ____,
        colorMode = 'text',
        ...other
      } = props;

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
        <Select
          // 垃圾 element-ui loading 没有效果
          {...withDirectives([[vLoading, loading.value]])}
          disabled={loading.value}
          loading={loading.value}
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
