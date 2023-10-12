import { InjectionKey } from '@wakeadmin/demi';
import { FatI18nContentOptions } from './types';

export const FatI18nContentKey: InjectionKey<FatI18nContentOptions> = Symbol('FatI18nContent');

let uuid = 0;

/**
 * 默认配置
 */
export const FatI18nContentDefaultOptions = {
  enable: true,
  position: 'rightCenter',
  sourceLanguage: 'zh',
  list: [
    {
      icon: '🇨🇳',
      tag: 'zh',
      name: '简体中文',
    },
    {
      icon: '🇺🇸',
      tag: 'en',
      name: 'English',
    },
  ],
  genUUID: async () => {
    console.warn('FatI18nContent: genUUID is not implemented');
    return `${Math.random()}${Date.now()}${uuid++}`;
  },
  format: '__i18n__({default},{uuid})',
  inject: (props, badge, target) => {
    return (
      <div class="fat-i18n-content-wrapper">
        {target()}
        {badge()}
      </div>
    );
  },
  save: async (id, changed, content) => {
    throw new Error('FatI18nContent: save is not implemented');
  },
  get: async id => {
    throw new Error('FatI18nContent: get is not implemented');
  },
} satisfies FatI18nContentOptions;
