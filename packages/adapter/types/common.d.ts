import { CSSProperties } from '@wakeadmin/demi';

export type ClassValue = string | { [key: string]: any } | ClassValue[];
export type StyleValue = string | CSSProperties | StyleValue[];

export type LooseClassValue = string | undefined | { [key: string]: any } | LooseClassValue[];
export type LooseStyleValue = string | undefined | CSSProperties | LooseStyleValue[];

export interface CommonProps {
  class?: ClassValue;
  style?: StyleValue;
}

/**
 * 组件key 的类型
 */
export type KeyType = string | number | symbol;
