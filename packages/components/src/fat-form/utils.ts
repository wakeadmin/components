import { FatFormItemProps } from './types';

export function validateFormItemProps(props: FatFormItemProps<any, any>) {
  if (props.prop == null) {
    throw new Error(`[fat-form-item] 必须指定 prop 属性`);
  }
}

/**
 * 获取根属性
 */
export function pickRootField(prop: string) {
  return prop.split('.').filter(Boolean)?.[0];
}
