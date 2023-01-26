import { Ref, unref, set } from '@wakeadmin/demi';

function clamp(value: number, max: number): number {
  return Math.max(0, Math.min(max, value));
}

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

/**
 * 将数组内的指定项移动到指定下标
 * @param arr
 * @param currentIndex
 * @param newIndex
 * @returns
 */
export function moveItemInArray<T = any>(arr: T[], currentIndex: number, newIndex: number): void {
  const from = clamp(currentIndex, arr.length - 1);
  const to = clamp(newIndex, arr.length - 1);

  if (from === to) {
    return;
  }
  const target = arr[from];
  const delta = from > to ? -1 : 1;
  let i = from;
  for (; i !== to; i += delta) {
    arr[i] = arr[i + delta];
  }
  arr[to] = target;
}

/**
 * 基于vue ref的数组操作
 *
 *
 * @param arr
 * @param currentIndex
 * @param newIndex
 */
export function moveItemInRefArray<T = any>(arr: Ref<T[]>, currentIndex: number, newIndex: number): void {
  // 垃圾vue

  const list = unref(arr);

  const from = clamp(currentIndex, list.length - 1);
  const to = clamp(newIndex, list.length - 1);

  if (from === to) {
    return;
  }
  const target = list[from];
  const delta = from > to ? -1 : 1;
  let i = from;
  for (; i !== to; i += delta) {
    set(list, i, list[i + delta]);
  }
  set(list, to, target);
}

export function transferArrayItem<T = any>(
  currentArray: T[],
  targetArray: T[],
  currentIndex: number,
  targetIndex: number
): void {
  const from = clamp(currentIndex, currentArray.length - 1);
  const to = clamp(targetIndex, targetArray.length);

  if (currentArray.length) {
    targetArray.splice(to, 0, currentArray.splice(from, 1)[0]);
  }
}
