export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}

export function takeString(value: any) {
  if (typeof value === 'string') {
    return value;
  }

  return '';
}

/**
 * 转换为数组
 */
export function toArray(value: any) {
  if (value == null) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  return [value];
}

export function toInt(value: any): number | undefined {
  if (value == null) {
    return undefined;
  }

  const v = typeof value === 'number' ? value : parseInt(value);

  if (Number.isNaN(v)) {
    return undefined;
  }

  return v;
}

export function toFloat(value: any): number | undefined {
  if (value == null) {
    return undefined;
  }

  const v = typeof value === 'number' ? value : parseFloat(value);

  if (Number.isNaN(v)) {
    return undefined;
  }

  return v;
}
