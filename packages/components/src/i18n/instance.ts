import get from 'lodash/get';
import { isDev } from '../utils/isDev';
import languages from '../locale/languages';

let instance: II18n;

const InterpolationReg = /{([a-z[\]0-9.-_]+)}/gi;

export function createT(sourceMap: Record<string, any>): <T = string>(key: string, data?: Record<string, any>) => T {
  return <T = string>(key: string, data?: Record<string, any>): T => {
    const text = get(sourceMap, key);

    if (data) {
      return text.replace(InterpolationReg, (_: string, interpolationKey: string) => get(data, interpolationKey) || '');
    }
    return text ?? '';
  };
}

function d(time: Date | string, format?: string) {
  if (isDev) {
    console.error('[@wakeadmin/component]: 不支持时间的国际化操作');
  }
  return String(time);
}

export const defaultI18nInstance: II18n = {
  t: createT(languages),
  d,
};

export interface II18n {
  t: <T>(key: string, data?: Record<string, any>) => T;
  d: (time: Date | string, format?: string) => string;
}

/**
 * @internal
 * @returns
 */
export function getI18nInstance(): II18n {
  return instance || defaultI18nInstance;
}

/**
 * @internal
 * @returns
 */
export function setI18nInstance(i18n: II18n | undefined | null): void {
  // @ts-expect-error
  instance = i18n;
}
