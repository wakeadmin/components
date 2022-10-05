import { PaginationProps } from '@wakeadmin/element-adapter';
import { OmitAtomicCommonProps } from '../atomic';

import {
  ADateRangeProps,
  AMultiSelectProps,
  APasswordProps,
  ASelectProps,
  ASwitchProps,
  ATextProps,
  ACheckboxProps,
  ARadioProps,
  AIntegerProps,
  ARateProps,
  ASliderProps,
  AProgressProps,
  ADateProps,
  ADateTimeProps,
  ADateTimeRangeProps,
  ATextareaProps,
  ATimeProps,
  ATimeRangeProps,
  ACheckboxsProps,
  AImagesProps,
  AImageProps,
  ASearchProps,
  AUrlProps,
  ACascaderLazyProps,
  ACascaderProps,
  AFloatProps,
  ACurrencyProps,
  AEmailProps,
} from '../builtin-atomic';
import { FatFormGlobalConfigurations } from '../fat-form';
import { FatFormPageLayout } from '../fat-form-layout';
import { FatTableGlobalConfigurations } from '../fat-table';

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
   * 时间格式, 默认为 HH:mm
   */
  timeFormat?: string;

  /**
   * 默认分页配置
   */
  pagination?: Omit<PaginationProps, 'total' | 'pageCount' | 'currentPage' | 'disabled'>;

  // -------------- 以下是内置原件的默认配置  -------------------
  /**
   * 文本组件默认配置
   */
  aTextProps?: OmitAtomicCommonProps<ATextProps>;

  /**
   * 长文本组件默认配置
   */
  aTextareaProps?: OmitAtomicCommonProps<ATextareaProps>;

  /**
   * 密码组件默认配置
   */
  aPasswordProps?: OmitAtomicCommonProps<APasswordProps>;

  /**
   * url 默认配置
   */
  aUrlProps?: OmitAtomicCommonProps<AUrlProps>;

  /**
   * email 默认配置
   */
  aEmailProps?: OmitAtomicCommonProps<AEmailProps>;

  /**
   * search 默认配置
   */
  aSearchProps?: OmitAtomicCommonProps<ASearchProps>;

  /**
   * switch 默认配置
   */
  aSwitchProps?: OmitAtomicCommonProps<ASwitchProps>;

  /**
   * select 默认配置
   */
  aSelectProps?: OmitAtomicCommonProps<ASelectProps>;

  /**
   * multi-select 默认配置
   */
  aMultiSelectProps?: OmitAtomicCommonProps<AMultiSelectProps>;

  /**
   * date 默认配置
   */
  aDateProps?: OmitAtomicCommonProps<ADateProps>;

  /**
   * date-time 默认配置
   */
  aDateTimeProps?: OmitAtomicCommonProps<ADateTimeProps>;

  /**
   * date-range 默认配置
   */
  aDateRangeProps?: OmitAtomicCommonProps<ADateRangeProps>;

  /**
   * date-time-range 默认配置
   */
  aDateTimeRangeProps?: OmitAtomicCommonProps<ADateTimeRangeProps>;

  /**
   * time 默认配置
   */
  aTimeProps?: OmitAtomicCommonProps<ATimeProps>;

  /**
   * time-range 默认配置
   */
  aTimeRangeProps?: OmitAtomicCommonProps<ATimeRangeProps>;

  /**
   * checkbox 默认配置
   */
  aCheckboxProps?: OmitAtomicCommonProps<ACheckboxProps>;

  /**
   * checkboxs 默认配置
   */
  aCheckboxsProps?: OmitAtomicCommonProps<ACheckboxsProps>;

  /**
   * radio 默认配置
   */
  aRadioProps?: OmitAtomicCommonProps<ARadioProps>;

  /**
   * integer 默认配置
   */
  aIntegerProps?: OmitAtomicCommonProps<AIntegerProps>;

  /**
   * float 默认配置
   */
  aFloatProps?: OmitAtomicCommonProps<AFloatProps>;

  /**
   * currency 默认配置
   */
  aCurrencyProps?: OmitAtomicCommonProps<ACurrencyProps>;

  /**
   * rate 默认配置
   */
  aRateProps?: OmitAtomicCommonProps<ARateProps>;

  /**
   * slider 默认配置
   */
  aSliderProps?: OmitAtomicCommonProps<ASliderProps>;

  /**
   * progress 默认配置
   */
  aProgressProps?: OmitAtomicCommonProps<AProgressProps>;

  /**
   * images 默认配置
   */
  aImagesProps?: OmitAtomicCommonProps<AImagesProps>;

  /**
   * image 默认配置
   */
  aImageProps?: OmitAtomicCommonProps<AImageProps>;

  /**
   * cascader-lazy 默认配置
   */
  aCascaderLazyProps?: OmitAtomicCommonProps<ACascaderLazyProps>;

  /**
   * cascader 默认配置
   */
  aCascaderProps?: OmitAtomicCommonProps<ACascaderProps>;

  /**
   * 表格全局配置
   */
  fatTable?: FatTableGlobalConfigurations;

  /**
   * 表单全局配置
   */
  fatForm?: FatFormGlobalConfigurations;

  /**
   * 自定义表单页面布局
   */
  fatFormPageLayout?: FatFormPageLayout;
}
