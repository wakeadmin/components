import { CSSProperties } from '@wakeadmin/demi';

export type ClassValue = string | undefined | { [key: string]: any } | ClassValue[];
export type StyleValue = string | CSSProperties;

export interface CommonProps {
  class?: ClassValue;
  style?: StyleValue;
}
