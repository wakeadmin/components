import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

export type ATextProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
  }
>;

declare global {
  interface AtomicProps {
    text: ATextProps;
  }
}

export const ATextComponent = defineAtomicComponent(
  (props: ATextProps) => {
    return () => {
      const { value, mode, onChange, renderPreview, scene, context, ...other } = props;
      return mode === 'preview' ? (
        <span class={other.class} style={other.style}>
          {renderPreview ? renderPreview(value) : value ? String(value) : ''}
        </span>
      ) : (
        <Input {...other} {...model(value, onChange!)} />
      );
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

globalRegistry.register('text', AText);
