export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}

export function takeString(value: any) {
  if (typeof value === 'string') {
    return value;
  }

  return '';
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
