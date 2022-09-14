export type Color = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | String;

const BUILTIN_COLORS = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

export function normalizeColor(color?: Color): string | undefined {
  if (!color) {
    return undefined;
  }

  if (BUILTIN_COLORS.includes(color as string)) {
    return `var(--fat-color-${color})`;
  }

  return color as string;
}
