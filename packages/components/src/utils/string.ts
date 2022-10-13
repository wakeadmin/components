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
