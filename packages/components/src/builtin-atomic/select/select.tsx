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
import { FatText, FatTextOwnProps, FatTextProps } from '../../fat-text';

export type ASelectValue = string | number;

export type ASelectProps = DefineAtomicProps<
  string | number,
  SelectProps,
  {
    /**
     * 注意，异步加载函数会在组件启动时执行，后面的变更不会被处理
     */
    options?: ASelectOption[] | (() => Promise<ASelectOption[]>);

    /**
     * 是否默认选中第一个选项，默认 false
     * 只有当 value 为空时有效
     */
    selectFirstByDefault?: boolean;

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

    textProps?: FatTextProps;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  } & FatTextOwnProps
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

    const disposeDefaultSelect = watchEffect(
      () => {
        const { selectFirstByDefault, value, onChange } = props;

        if (selectFirstByDefault && value == null && options.value.length > 0) {
          onChange?.(options.value[0].value);
          disposeDefaultSelect();
        }
      },
      { flush: 'post' }
    );

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
        undefinedPlaceholder,

        // text props
        ellipsis,
        copyable,
        tag,
        underline,
        color,
        textProps,
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(active.value);
        }

        return (
          <FatText
            class={normalizeClassName(other.class, 'fat-a-select', 'fat-a-select--preview', {
              'fat-a-select--color': active.value?.color,
              'fat-a-select--color-dot': props.colorMode === 'dot',
            })}
            style={normalizeStyle(other.style, { '--fat-a-select-color': normalizeColor(active.value?.color) })}
            {...{ ellipsis, copyable, tag, underline, color }}
            {...textProps}
          >
            {active.value?.label ?? undefinedPlaceholder ?? configurable.undefinedPlaceholder}
          </FatText>
        );
      }

      return (
        <Select
          // 垃圾 element-ui loading 没有效果
          {...withDirectives([[vLoading, loading.value]])}
          disabled={loading.value}
          loading={loading.value}
          // 清除后强制设置为 undefined
          onClear={() => onChange?.(undefined)}
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
