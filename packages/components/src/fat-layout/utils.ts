import { isVue2 } from '@wakeadmin/demi';

export const isWakeadminBayEnabled = () => {
  return '__MAPP_SERVICES__' in window;
};

/**
 * 传入 HTML 自定义元素 slot 属性
 * @param name
 * @returns
 */
export const ceSlot = (name: string) => {
  return isVue2 ? { attrs: { slot: name } } : { slot: name };
};
