import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps, FatTextProps } from '../../fat-text';
import { takeString } from '../../utils';

export type ATextProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value?: string) => any;
    /**
     * 透传 FatText 参数
     */
    textProps?: FatTextProps;
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
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        if (value == null) {
          return (
            <span class={other.class} style={other.style}>
              {configurable.undefinedPlaceholder}
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

      placeholder ??= `请输入${takeString(context?.label)}`;

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
