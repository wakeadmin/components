import { InputProps, Input, model } from '@wakeadmin/component-adapter';
import { unref } from '@wakeadmin/demi';

import { globalRegistry, defineAtomic, defineAtomicComponent, DefineAtomicProps } from '../../atomic';
import { useFatConfigurable } from '../../fat-configurable';

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

export const ATextComponent = defineAtomicComponent((props: ATextProps) => {
  const configurable = useFatConfigurable();

  return () => {
    const { value, mode, onChange, renderPreview, scene, context, ...other } = props;
    return mode === 'preview' ? (
      <span class={other.class} style={other.style}>
        {renderPreview ? renderPreview(value) : value ? String(value) : ''}
      </span>
    ) : (
      <Input {...unref(configurable).aTextProps} {...other} {...model(value, onChange!)} />
    );
  };
}, 'AText');

export const APasswordComponent = defineAtomicComponent((props: APasswordProps) => {
  const configurable = useFatConfigurable();
  return () => {
    return ATextComponent({
      renderPreview: value => <span>* * * * *</span>,
      showPassword: true,
      ...unref(configurable).aPasswordProps,
      ...props,
    });
  };
});

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
