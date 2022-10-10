/**
 * element-ui 使用自定义的时间格式，而 element-plus 使用的是 dayjs
 */

/**
 * format 使用 dayjs 标准
 * @param {string} format
 */
export function normalizeDateFormat(format) {
  return format
    .replace(/(Y{2,4})/g, 'yyyy')
    .replace(/D/g, 'd')
    .replace(/w/g, 'W')
    .replace(/s/g, 'S')
    .replace(/x/g, 'timestamp');
}
