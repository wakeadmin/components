import { ButtonProps } from './button';

export interface DropdownProps {
  trigger?: 'focus' | 'hover' | 'click' | 'contextmenu';
  effect?: string;
  type?: ButtonProps['type'];
  placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end';
  size?: string;
  splitButton?: boolean;
  hideOnClick?: boolean;
  showTimeout?: number;
  hideTimeout?: number;
  tabindex?: number;
  disabled?: boolean;

  onClick?: () => any;
  onVisibleChange?: (visible: any) => any;
  onCommand?: (command: any) => any;
}

export const Dropdown: (props: DropdownProps) => any;

export interface DropdownItemProps {
  command?: any;
  disabled?: boolean;
  divided?: boolean;
  icon?: any;
}

export const DropdownItem = (props: DropdownItemProps) => any;

export const DropdownMenu = (props: {}) => any;
