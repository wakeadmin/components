/**
 * 数组比较。子节点浅比较
 * @param a
 * @param b
 * @returns
 */
export function arrayEq(a: any[], b: any[]) {
  // eslint-disable-next-line eqeqeq
  if (a == b) {
    return true;
  }

  if (!Array.isArray(a) || !Array.isArray(b)) {
    return false;
  }

  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}
