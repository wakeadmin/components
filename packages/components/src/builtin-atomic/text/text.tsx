import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps, FatTextProps } from '../../fat-text';
import { useT } from '../../hooks';
import { takeString } from '../../utils';
import { isEmpty } from './utils';

export type ATextProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value?: string) => any;
    /**
     * 透传 FatText 参数
     */
    textProps?: FatTextProps;

    /**
     * 未定义时的占位符
     */
    undefinedPlaceholder?: any;
  } & FatTextOwnProps
>;

declare global {
  interface AtomicProps {
    text: ATextProps;
  }
}

export const ATextComponent = defineAtomicComponent(
  (props: ATextProps) => {
    const configurable = useFatConfigurable();
    const t = useT();

    return () => {
      let {
        value,
        mode,
        onChange,
        scene,
        context,

        renderPreview,
        ellipsis,
        copyable,
        tag,
        underline,
        placeholder,
        color,
        textProps,
        undefinedPlaceholder,
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        if (isEmpty(value)) {
          return (
            <span class={other.class} style={other.style}>
              {undefinedPlaceholder ?? configurable.undefinedPlaceholder}
            </span>
          );
        }

        return (
          <FatText
            class={other.class}
            style={other.style}
            {...{ ellipsis, copyable, tag, underline, color }}
            {...textProps}
          >
            {String(value)}
          </FatText>
        );
      }

      placeholder ??= t('wkc.enterValue', { value: takeString(context?.label) });

      return <Input {...other} placeholder={placeholder} {...model(value, onChange!)} />;
    };
  },
  { name: 'AText', globalConfigKey: 'aTextProps' }
);

export const AText = defineAtomic({
  name: 'text',
  component: ATextComponent,
  description: '文本输入',
  author: 'ivan-lee',
});
