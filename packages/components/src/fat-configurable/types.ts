import { PaginationProps } from '@wakeadmin/component-adapter';
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
   * 默认分页配置
   */
  pagination?: Omit<PaginationProps, 'total' | 'pageCount' | 'currentPage' | 'disabled'>;

  // -------------- 以下是内置原件的默认配置  -------------------
  /**
   * 文本组件默认配置
   */
  aTextProps?: OmitAtomicCommonProps<ATextProps>;

  /**
   * 密码组件默认配置
   */
  aPasswordProps?: OmitAtomicCommonProps<APasswordProps>;

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
   * date-range 默认配置
   */
  aDateRangeProps?: OmitAtomicCommonProps<ADateRangeProps>;

  /**
   * checkbox 默认配置
   */
  aCheckboxProps?: OmitAtomicCommonProps<ACheckboxProps>;

  /**
   * radio 默认配置
   */
  aRadioProps?: OmitAtomicCommonProps<ARadioProps>;

  /**
   * integer 默认配置
   */
  aIntegerProps?: OmitAtomicCommonProps<AIntegerProps>;

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
