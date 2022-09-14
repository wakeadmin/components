import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
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

export const ATextareaComponent = defineAtomicComponent(
  (props: ATextareaProps) => {
    return () => {
      const { value, mode, onChange, renderPreview, scene, context, ...other } = props;
      return mode === 'preview' ? (
        <p class={normalizeClassName('fat-a-textarea-preview', other.class)} style={other.style}>
          {renderPreview ? renderPreview(value) : value ? String(value) : ''}
        </p>
      ) : (
        <Input type="textarea" {...other} {...model(value, onChange!)} />
      );
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

globalRegistry.register('textarea', ATextarea);
