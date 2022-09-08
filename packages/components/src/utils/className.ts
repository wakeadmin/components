import { LooseClassValue } from '@wakeadmin/component-adapter';

export function normalizeClassName(...list: LooseClassValue[]) {
  let className = '';

  const concat = (next: string) => {
    const trimed = next.trim();
    if (trimed) {
      className += ' ' + trimed;
    }
  };

  for (const item of list) {
    if (!item) {
      continue;
    }

    if (typeof item === 'string') {
      concat(item);
    } else if (Array.isArray(item)) {
      concat(normalizeClassName.apply(null, item));
    } else if (typeof item === 'object') {
      for (const name in item) {
        if (item[name]) {
          concat(name);
        }
      }
    }
  }

  return className.trim();
}
