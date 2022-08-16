export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}
