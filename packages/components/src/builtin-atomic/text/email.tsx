import { EMAIL_REG } from '@wakeadmin/utils';

import { defineAtomic, defineAtomicComponent } from '../../atomic';
import { getI18nInstance } from '../../i18n';

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
      const i18n = getI18nInstance();
      throw new Error(i18n.t('wkc.enterCorrectEmail'));
    }
  },
  validateTrigger: 'blur',
});
