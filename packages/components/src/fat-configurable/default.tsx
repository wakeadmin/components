import { FatConfigurable } from './types';

/**
 * 定义默认配置
 */
export const DEFAULT_CONFIGURABLE: FatConfigurable = {
  undefinedPlaceholder: '--',

  dateFormat: 'YYYY-MM-DD',

  dateTimeFormat: 'YYYY-MM-DD HH:mm:SS',

  pagination: {
    pageSize: 10,
    layout: 'prev, pager, next, jumper, sizes, total',
    pageSizes: [10, 20, 30, 40, 50, 100],
  },
};
