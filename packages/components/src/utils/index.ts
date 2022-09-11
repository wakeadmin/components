export * from './className';
export * from './style';
export * from './merge-props';
export * from './ref';
export * from './types';
export * from './expose';
export * from './object';
export * from './atom';
export * from './render';

export function settledThrowIfNeed(results?: PromiseSettledResult<any>[]) {
  if (results == null || results.length === 0) {
    return;
  }

  for (const result of results) {
    if (result.status === 'rejected') {
      throw result.reason;
    }
  }
}

export function toUndefined<T>(value: T | undefined | null): T | undefined {
  return value != null ? value : undefined;
}
