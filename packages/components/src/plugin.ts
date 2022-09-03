import { plugin as hPlugin } from '@wakeadmin/h';
import { hasProp, addHiddenProp } from '@wakeadmin/utils';
import { isVue2 } from '@wakeadmin/demi';

import './builtin-atomic';

const INSTALLED = Symbol('wakeadmin-plugin-installed');

export const plugin = {
  install(app: any) {
    if (hasProp(app, INSTALLED)) {
      return;
    }

    addHiddenProp(app, INSTALLED, 1);

    hPlugin.install(app);

    // 添加全局命名空间

    if (isVue2) {
      window.document.body.classList.add('vue2');
    }
  },
};
