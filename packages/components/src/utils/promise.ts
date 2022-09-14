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
