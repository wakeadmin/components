import { OptionProps } from '@wakeadmin/element-adapter';

export interface ASelectOption extends OptionProps {
  /**
   * 颜色
   */
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | string;
}

const BUILTIN_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

export function normalizeColor(color?: string) {
  if (!color) {
    return undefined;
  }

  if (BUILTIN_COLORS.includes(color)) {
    return `var(--fat-color-${color})`;
  }

  return color;
}
