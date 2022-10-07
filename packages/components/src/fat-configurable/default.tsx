import { FatConfigurable } from './types';

/**
 * 定义默认配置
 */
export const DEFAULT_CONFIGURABLE: FatConfigurable = {
  undefinedPlaceholder: '——',

  dateFormat: 'YYYY-MM-DD',

  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',

  timeFormat: 'HH:mm',

  pagination: {
    pageSize: 10,
    layout: 'prev, pager, next, jumper, sizes, total',
    pageSizes: [10, 20, 30, 40, 50, 100],
  },

  aTextProps: {},

  aTextareaProps: {
    placeholder: '请输入',
    rows: 4,
    showWordLimit: true,
    autosize: { minRows: 4, maxRows: 10 },
  },

  aPasswordProps: {
    placeholder: '请输入密码',
  },

  aSearchProps: {
    placeholder: '请输入关键字',
  },

  aUrlProps: {
    placeholder: '请输入链接',
    copyable: true,
    ellipsis: 1,
  },

  aEmailProps: {
    placeholder: '请输入邮箱',
  },

  aPhoneProps: {
    placeholder: '请输入手机号码',
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

  aDateProps: {
    placeholder: '请选择日期',
  },

  aDateTimeProps: {
    placeholder: '请选择时间',
  },

  aTimeProps: {
    placeholder: '请选择时间',
  },

  aDateRangeProps: {
    startPlaceholder: '开始日期',
    endPlaceholder: '结束日期',
    rangeSeparator: '至',
  },

  aDateTimeRangeProps: {
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    rangeSeparator: '至',
  },

  aTimeRangeProps: {
    startPlaceholder: '开始时间',
    endPlaceholder: '结束时间',
    rangeSeparator: '至',
  },

  aCheckboxProps: {
    previewActiveText: '开启',
    previewInactiveText: '关闭',
  },

  aCascaderLazyProps: {
    placeholder: '请选择',
  },

  aCascaderProps: {
    placeholder: '请选择',
  },

  aIntegerProps: {
    placeholder: '请输入整数',
    max: Number.MAX_SAFE_INTEGER,
  },

  aFloatProps: {
    placeholder: '请输入数字',
  },

  aCurrencyProps: {
    placeholder: '请输入',
  },

  aCaptchaProps: {
    placeholder: '请输入验证码',
  },
};
