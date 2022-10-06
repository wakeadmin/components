import { plugin as hPlugin } from '@wakeadmin/h';
import { hasProp, addHiddenProp } from '@wakeadmin/utils';
import { isVue2 } from '@wakeadmin/demi';

import {
  ACheckbox,
  ACheckboxs,
  ADate,
  ADateRange,
  ADateTime,
  ADateTimeRange,
  AImage,
  AImages,
  AInteger,
  AFloat,
  ACurrency,
  AProgress,
  ARadio,
  ARate,
  AMultiSelect,
  ASelect,
  ASlider,
  ASwitch,
  APassword,
  ASearch,
  AText,
  ATextarea,
  AUrl,
  AEmail,
  ATime,
  ATimeRange,
  ACascaderLazy,
  ACascader,
  AFiles,
  AFile,
  APhone,
} from './builtin-atomic';
import { globalRegistry } from './atomic';

const INSTALLED = Symbol('wakeadmin-plugin-installed');

let maybeInstalled = false;
let builtinAtomicsInstalled = false;

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

/**
 * 安装内置插件
 */
function registerAtomics() {
  if (builtinAtomicsInstalled) {
    return;
  }

  builtinAtomicsInstalled = true;

  const list = [
    ACheckbox,
    ACheckboxs,
    ADate,
    ADateRange,
    ADateTime,
    ADateTimeRange,
    AImage,
    AImages,
    AFiles,
    AFile,
    AInteger,
    AFloat,
    ACurrency,
    AProgress,
    ARadio,
    ARate,
    AMultiSelect,
    ASelect,
    ASlider,
    ASwitch,
    APassword,
    ASearch,
    AText,
    ATextarea,
    AUrl,
    AEmail,
    APhone,
    ATime,
    ATimeRange,
    ACascaderLazy,
    ACascader,
  ];

  for (const item of list) {
    globalRegistry.register(item.name, item);
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
    registerAtomics();

    // 添加全局命名空间
    if (isVue2) {
      window.document.body.classList.add('vue2');
    }
  },
};
