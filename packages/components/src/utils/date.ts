import { isVue2 } from '@wakeadmin/demi';
import mem from 'lodash/memoize';
import { formatDate as overrideFormatDate } from '@wakeadmin/utils';

/**
 * element-ui 使用了自定义的时间格式：
 *
 * | dayjs  | element-ui |
 * |--------|------------|
 * | YYYY   | yyyy       |
 * | w/ww   | W/WW      |
 * | DD     | dd        |
 * | ss     | SS        |
 * | x      | timestamp | 毫秒
 *
 * 规范化时间格式，以 dayjs 为基准, 转换为 dayjs 能识别的格式
 *
 * @param format
 */
export const normalizeToDayjsFormat = mem((format: string): string => {
  return (
    format
      .replace(/yyyy/g, 'YYYY')
      .replace(/d/g, 'D')
      // https://dayjs.gitee.io/docs/zh-CN/plugin/advanced-format, 使用 WeekOfYear, 小写 w
      .replace(/W/g, 'w')
      .replace(/S/g, 's')
      .replace('timestamp', 'x')
  );
});

/**
 * 格式化日期：vue 2 下需要进行规范化
 */
export const formatDate: typeof overrideFormatDate = isVue2
  ? (date, format, parseFormat) => {
      return overrideFormatDate(
        date,
        format && normalizeToDayjsFormat(format),
        parseFormat &&
          (Array.isArray(parseFormat) ? parseFormat.map(normalizeToDayjsFormat) : normalizeToDayjsFormat(parseFormat))
      );
    }
  : overrideFormatDate;
