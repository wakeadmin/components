export interface ButtonProps {
  size?: string;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'text';
  icon?: any;
  nativeType?: 'button' | 'submit' | 'reset';
  loading?: boolean;
  loadingIcon?: any;
  plain?: boolean;
  text?: boolean;
  link?: boolean;
  bg?: boolean;
  autofocus?: boolean;
  round?: boolean;
  circle?: boolean;
  color?: string;
  dark?: boolean;
  autoInsertSpace?: boolean;
  onClick?: ((evt: MouseEvent) => any) | undefined;
}
export const Button: (props: ButtonProps) => any;
