import { InjectionKey } from '@wakeadmin/demi';
import { OmitUnderScore } from '../utils';

import { FatFormItemInheritableProps, FatFormItemWidth, FatFormMethods } from './types';

export const FatFormContext: InjectionKey<FatFormMethods<any>> = Symbol('fat-form-context');

export const FatFormInheritanceContext: InjectionKey<FatFormItemInheritableProps> =
  Symbol('fat-form-inheritance-context');

/**
 * 预定义的字段宽度
 *
 * mini=104px 适用于短数字、短文本或选项。
 * small=216px 适用于较短字段录入、如姓名、电话、ID 等。
 * medium=328px 标准宽度，适用于大部分字段长度。
 * large=440px 适用于较长字段录入，如长网址、标签组、文件路径等。
 * huge=552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用。
 */
export const PreDefinedItemWidth: Record<FatFormItemWidth, number> = {
  mini: 104,
  small: 216,
  medium: 328,
  large: 440,
  huge: 552,
};

/**
 * 定义所有公开的实例方法名称
 */
export const FatFormPublicMethodKeys: (keyof OmitUnderScore<FatFormMethods<any>>)[] = [
  'mode',
  'layout',
  'labelWidth',
  'labelSuffix',
  'disabled',
  'error',
  'loading',
  'submitting',
  'values',
  'formRef',
  'submit',
  'request',
  'reset',
  'validate',
  'validateField',
  'isFieldTouched',
  'clearValidate',
  'getFieldValue',
  'setFieldValue',
];
