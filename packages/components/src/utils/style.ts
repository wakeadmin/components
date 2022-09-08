import { LooseStyleValue } from '@wakeadmin/component-adapter';

const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
export type NormalizedStyle = Record<string, string | number>;

/**
 * 转换字符串类型的 style 为对象
 * @param cssText
 * @returns
 */
function parseStringStyle(cssText: string): NormalizedStyle {
  const ret: NormalizedStyle = {};
  cssText.split(listDelimiterRE).forEach(item => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}

/**
 * 规范化 Vue 的 style props
 * 支持更加宽松的输入已经兼容 vue2/3
 */
export function normalizeStyle(...styles: LooseStyleValue[]): NormalizedStyle {
  const style: Record<string, any> = {};

  for (const item of styles) {
    if (!item) {
      continue;
    }

    let value: NormalizedStyle | undefined;
    if (typeof item === 'string') {
      value = parseStringStyle(item);
    } else if (Array.isArray(item)) {
      value = normalizeStyle.apply(null, item);
    } else if (typeof item === 'object') {
      value = item as NormalizedStyle;
    }

    if (value) {
      Object.assign(style, value);
    }
  }

  return style;
}
