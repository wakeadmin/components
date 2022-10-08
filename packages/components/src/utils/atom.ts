import { isPlainObject } from '@wakeadmin/utils';

/**
 * 符合 atom 参数
 * @param builtinProps
 * @param userProps
 */
export function composeAtomProps(builtinProps: Record<string, any>, userProps?: Record<string, any>) {
  if (userProps == null || !isPlainObject(userProps)) {
    return builtinProps;
  }

  const keys = Object.keys(userProps);
  if (keys.length === 0) {
    return builtinProps;
  }

  for (const key of keys) {
    const value = (userProps as any)[key];
    if (!(key in builtinProps)) {
      // 直接写入
      builtinProps[key] = value;
      continue;
    }

    // 复合函数
    if (typeof value === 'function' && typeof builtinProps[key] === 'function' && key.startsWith('on')) {
      const builtinValue = builtinProps[key];
      builtinProps[key] = function () {
        const rtn = builtinValue.apply(this, arguments);
        value.apply(this, arguments);

        return rtn;
      };
    } else {
      // 覆盖
      builtinProps[key] = value;
    }
  }

  return builtinProps;
}
