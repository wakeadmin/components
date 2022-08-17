export interface FormMethods {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: () => void;
}

export interface FormProps {
  model?: any;
  rules?: Record<string, any>;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: string;
  disabled?: string;
  validateOnRuleChange?: string;
  hideRequiredAsterisk?: boolean;
}

export const Form = (props: FormProps) => any;

export interface FormItemProps {
  label?: string;
  labelWidth?: string | number;
  prop?: string;
  required?: boolean;
  rules?: any[];
  error?: string;
  inlineMessage?: boolean;
  showMessage?: boolean;
  size?: string;
}
export const FormItem = (props: FormItemProps) => any;
