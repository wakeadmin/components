import { PaginationProps } from '@wakeadmin/component-adapter';

/**
 * 这里定义了组件库一些可以全局配置的参数
 */
export interface FatConfigurable {
  /**
   * 字段未定义时展示的字符。默认为 --
   * 在表格、表单预览时有效
   */
  undefinedPlaceholder?: string;

  /**
   * 日期格式, 默认为 YYYY-MM-DD
   */
  dateFormat?: string;

  /**
   * 日期时间格式，默认为 YYYY-MM-DD HH:mm:SS，格式参考 dayjs
   */
  dateTimeFormat?: string;

  /**
   * 默认分页配置
   */
  pagination?: Omit<PaginationProps, 'total' | 'pageCount' | 'currentPage' | 'disabled'>;

  // -------------- 以下是内置原件的默认配置  -------------------
  // TODO

  // -------------- 以下是布局配置 ------------------------
  // TODO
  // 表格页面布局配置
  // 表单页面布局配置
}
