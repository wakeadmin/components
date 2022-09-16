import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { FatText, FatTextOwnProps } from '../../fat-text';
import { normalizeClassName } from '../../utils';

export type ATextareaProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
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
            class={normalizeClassName('fat-a-textarea-preview', other.class)}
            style={other.style}
            {...{
              ellipsis,
              copyable,
              tag,
              underline,
              color,
            }}
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
