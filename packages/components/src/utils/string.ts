const CAMELIZE_REGEXP = /(-|_|\.|\s)+(.)?/g;

/**
 * 如果值是字符串类型，就直接返回
 * @param value
 * @returns
 */
export function takeString(value: any) {
  if (typeof value === 'string') {
    return value;
  }

  return '';
}

export function filterStringByRegexp(value: any, reg: RegExp) {
  if (typeof value !== 'string') {
    return value;
  }

  const matched = value.match(reg);
  if (matched === null) {
    return '';
  }

  return matched[0];
}

export function filterStringByTrim(value: any) {
  if (typeof value === 'string') {
    return value.trim();
  }

  return value;
}

/**
 * 转换成小写驼峰格式
 *
 * @example
 * ```javascript
 * camelize('innerHTML');          // 'innerHTML'
 * camelize('action_name');        // 'actionName'
 * camelize('css-class-name');     // 'cssClassName'
 * camelize('update:modalValue');  // 'update:modalValue'
 * camelize('update:modal-value');  // 'update:modalValue'
 * camelize('Q w Q');  // 'QWQ'
 * ```
 * @param str
 */
export function camelize(str: string): string {
  return str
    .replace(CAMELIZE_REGEXP, (_: string, __: string, chr: string) => {
      return chr ? chr.toUpperCase() : '';
    })
    .replace(/^([A-Z])/, (chr: string) => chr.toLowerCase());
}
