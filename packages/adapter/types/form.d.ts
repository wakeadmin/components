import { Rule, Rules } from './async-validator';

export interface FormMethods {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
  validateField: (props: string | string[]) => Promise<boolean>;
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

export const Form = (props: FormProps) => any;

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
export const FormItem = (props: FormItemProps) => any;
