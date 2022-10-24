import { Rule, Rules } from './async-validator';

export interface FormMethods {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;

  // element-ui 返回的不是一个 promise, 只能用 callback, 而且 callback 在验证多个字段时，会触发多次
  // element-plus 返回的是一个 promise
  validateField: ((props: string | string[], cb: (error?: string) => void) => void) &
    ((props: string | string[]) => Promise<void>);
}

export interface FormProps {
  model?: any;
  rules?: Rules;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: string;
  disabled?: boolean;
  validateOnRuleChange?: boolean;
  hideRequiredAsterisk?: boolean;

  onValidate?: (prop: string, valid: boolean, message?: string) => void;
}

export const Form: (props: FormProps) => any;

export interface FormItemProps {
  label?: string;
  labelWidth?: string | number;
  prop?: string;
  required?: boolean;
  rules?: Rule;
  error?: string;
  inlineMessage?: boolean;
  showMessage?: boolean;
  size?: string;
}
export const FormItem: (props: FormItemProps) => any;
