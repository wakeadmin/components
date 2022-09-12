import { InputProps, Input, model } from '@wakeadmin/component-adapter';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';
import { normalizeClassName } from '../../utils';

export type ATextareaProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
  }
>;

declare global {
  interface AtomicProps {
    textarea: ATextareaProps;
  }
}

export const ATextareaComponent = defineAtomicComponent((props: ATextareaProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, renderPreview, scene, context, ...other } = props;
    return mode === 'preview' ? (
      <p class={normalizeClassName('fat-a-textarea-preview', other.class)} style={other.style}>
        {renderPreview ? renderPreview(value) : value ? String(value) : ''}
      </p>
    ) : (
      <Input type="textarea" {...configurable.aTextareaProps} {...other} {...model(value, onChange!)} />
    );
  };
}, 'ATextarea');

export const ATextarea = defineAtomic({
  name: 'textarea',
  component: ATextareaComponent,
  description: '长文本输入',
  author: 'ivan-lee',
});

globalRegistry.register('textarea', ATextarea);
