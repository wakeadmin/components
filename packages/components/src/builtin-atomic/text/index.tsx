import { InputProps, Input, model } from '@wakeadmin/element-adapter';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';

export type ATextProps = DefineAtomicProps<
  string,
  InputProps,
  {
    renderPreview?: (value: any) => any;
  }
>;

export type APasswordProps = Omit<ATextProps, 'showPassword'>;

declare global {
  interface AtomicProps {
    text: ATextProps;
    password: APasswordProps;
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

export const APasswordComponent = defineAtomicComponent(
  (props: APasswordProps) => {
    return () => {
      return ATextComponent({
        renderPreview: value => <span>* * * * *</span>,
        showPassword: true,
        ...props,
      });
    };
  },
  { name: 'APassword', globalConfigKey: 'aPasswordProps' }
);

export const AText = defineAtomic({
  name: 'text',
  component: ATextComponent,
  description: '文本输入',
  author: 'ivan-lee',
});

export const APassword = defineAtomic({
  name: 'password',
  component: APasswordComponent,
  description: '密码输入',
  author: 'ivan-lee',
});

globalRegistry.register('text', AText);
globalRegistry.register('password', APassword);
