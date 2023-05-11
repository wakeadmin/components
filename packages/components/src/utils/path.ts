import memoize from 'lodash/memoize';
import toPath from 'lodash/toPath';

/**
 * Returns an array of path segments.
 * If the path is a string, the array will be frozen in development mode.
 */
export const getPaths = memoize((path: string): readonly string[] => {
  if (process.env.NODE_ENV !== 'production') {
    return Object.freeze(toPath(path));
  }

  return toPath(path);
});

/**
 * 获取父路径
 */
export const getParentPath = memoize((path: string) => {
  return getPaths(path).slice(0, -1).join('.');
});
