export interface FormMethods {
  validate: () => Promise<boolean>;
  resetFields: () => void;
  clearValidate: (props?: string | string[]) => void;
  validateField: (props: string | string[]) => Promise<boolean>;
}

export interface FormProps {
  model?: any;
  rules?: Record<string, any>;
  labelPosition?: 'left' | 'right' | 'top';
  labelWidth?: string | number;
  labelSuffix?: string;
  inline?: boolean;
  inlineMessage?: boolean;
  statusIcon?: boolean;
  showMessage?: boolean;
  size?: string;
  disabled?: boolean;
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
