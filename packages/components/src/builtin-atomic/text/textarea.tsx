import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps, FatTextProps } from '../../fat-text';
import { normalizeClassName } from '../../utils';

export type ATextareaProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
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
    textarea: ATextareaProps;
  }
}

export const ATextareaComponent = defineAtomicComponent(
  (props: ATextareaProps) => {
    const configurable = useFatConfigurable();

    return () => {
      const {
        value,
        mode,
        onChange,
        renderPreview,
        scene,
        context,
        ellipsis,
        copyable,
        tag = 'p',
        underline,
        color,
        textProps,
        undefinedPlaceholder,
        ...other
      } = props;

      if (mode === 'preview') {
        if (renderPreview) {
          return renderPreview(value);
        }

        if (!value) {
          return (
            <span class={other.class} style={other.style}>
              {undefinedPlaceholder ?? configurable.undefinedPlaceholder}
            </span>
          );
        }

        return (
          <FatText
            class={normalizeClassName('fat-a-textarea-preview', other.class)}
            style={other.style}
            {...{
              ellipsis,
              copyable,
              tag,
              underline,
              color,
            }}
            {...textProps}
          >
            {String(value)}
          </FatText>
        );
      }

      return <Input type="textarea" {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ATextarea', globalConfigKey: 'aTextareaProps' }
);

export const ATextarea = defineAtomic({
  name: 'textarea',
  component: ATextareaComponent,
  description: '长文本输入',
  author: 'ivan-lee',
});
