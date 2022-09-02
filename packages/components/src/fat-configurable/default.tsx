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

  aTextProps: {
    placeholder: '请输入',
  },

  aPasswordProps: {
    placeholder: '请输入密码',
  },

  aSwitchProps: {
    previewActiveText: '开启',
    previewInactiveText: '关闭',
  },

  aSelectProps: {
    placeholder: '请选择',
  },

  aMultiSelectProps: {
    placeholder: '请选择',
  },

  aDateRangeProps: {
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    rangeSeparator: '至',
  },

  aCheckboxProps: {
    previewActiveText: '开启',
    previewInactiveText: '关闭',
  },
};
