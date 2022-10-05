import { EMAIL_REG } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent } from '../../atomic';

import { ATextProps, ATextComponent } from './text';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AEmailProps extends ATextProps {}

declare global {
  interface AtomicProps {
    email: AEmailProps;
  }
}

export const AEmailComponent = defineAtomicComponent(ATextComponent.__setup__, {
  name: 'AEmail',
  globalConfigKey: 'aEmailProps',
});

export const AEmail = defineAtomic({
  name: 'email',
  component: AEmailComponent,
  description: '邮箱输入框',
  author: 'ivan-lee',
  async validate(value) {
    if (value && !EMAIL_REG.test(value)) {
      throw new Error('请输入正确的邮箱地址');
    }
  },
  validateTrigger: 'blur',
});
