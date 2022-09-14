import { globalRegistry, defineAtomic, defineAtomicComponent } from '../../atomic';

import { ATextProps, ATextComponent } from './text';

export type APasswordProps = Omit<ATextProps, 'showPassword' | 'type'>;

declare global {
  interface AtomicProps {
    password: APasswordProps;
  }
}

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

export const APassword = defineAtomic({
  name: 'password',
  component: APasswordComponent,
  description: '密码输入',
  author: 'ivan-lee',
});

globalRegistry.register('password', APassword);
