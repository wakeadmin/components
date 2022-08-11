import { registerBundles } from '@wakeadmin/i18n-legacy';

registerBundles({
  zh: () => import('./zh.tr'),
  en: () => import('./en.tr'),
  'zh-Hant': () => import('./zh-Hant.tr'),
  'th-Hant': () => import('./th.tr'),
});
