export const KB = 1024;
export const MB = KB * 1024;
export const GB = MB * 1024;
export const TB = GB * 1024;
export const PB = TB * 1024;

const SIZES: [number, string][] = [
  [PB, 'PB'],
  [TB, 'TB'],
  [GB, 'GB'],
  [MB, 'MB'],
  [KB, 'KB'],
];

export function trimEndingZero(num: number, fixed: number = 2) {
  const value = num.toFixed(fixed);

  if (!value.includes('.')) {
    return value;
  }

  for (let i = value.length - 1; i >= 0; i--) {
    const char = value[i];
    if (char === '0') {
      continue;
    }

    if (char === '.') {
      i--;
    }

    return value.slice(0, i + 1);
  }

  return value;
}

export function formatFileSize(bytes: number): string {
  for (const [size, name] of SIZES) {
    if (bytes >= size) {
      return trimEndingZero(bytes / size) + ' ' + name;
    }
  }

  return bytes + ' B';
}
