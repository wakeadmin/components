import { plugin as hPlugin } from '@wakeadmin/h';
import { hasProp, addHiddenProp } from '@wakeadmin/utils';
import { isVue2 } from '@wakeadmin/demi';

import './builtin-atomic';

const INSTALLED = Symbol('wakeadmin-plugin-installed');

let maybeInstalled = false;

let warned = false;

export function assertPluginInstalled() {
  if (warned) {
    return;
  }

  warned = true;
  if (!maybeInstalled) {
    console.error(`[wakeadmin/components] plugin 未安装，这可能会导致程序异常`);
  }
}

export const plugin = {
  install(app: any) {
    if (hasProp(app, INSTALLED)) {
      return;
    }

    addHiddenProp(app, INSTALLED, 1);
    maybeInstalled = true;

    hPlugin.install(app);

    // 添加全局命名空间

    if (isVue2) {
      window.document.body.classList.add('vue2');
    }
  },
};
