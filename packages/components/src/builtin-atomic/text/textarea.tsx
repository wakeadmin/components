import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps, FatTextProps } from '../../fat-text';
import { normalizeClassName } from '../../utils';
import { isEmpty } from './utils';

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

    /**
     * 自定义 Input 实现
     */
    customInput?: any;
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

        customInput,
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

      const Tag = customInput ?? Input;

      return <Tag type="textarea" {...other} {...model(value, onChange!)} />;
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
