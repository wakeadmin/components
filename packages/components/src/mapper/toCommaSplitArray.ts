import { FatFormItemMapper } from '../fat-form';

export const toCommaSplitArray: FatFormItemMapper = {
  in(value: unknown) {
    if (!value) {
      return [];
    }

    if (typeof value !== 'string' && process.env.NODE_ENV !== 'production') {
      console.warn(`expected to get string, but got`, value);
      return [];
    }

    return (value as string).split(',').map(item => item.trim());
  },
  out(value: unknown) {
    if (!Array.isArray(value)) {
      return '';
    }
    return value.join(',');
  },
};

export const toCommaSplitNumberArray: FatFormItemMapper = {
  in(value) {
    const list = toCommaSplitArray.in(value) as unknown[];
    const result = list.map(i => Number(i));

    if (process.env.NODE_ENV !== 'production' && result.some(i => Number.isNaN(i))) {
      console.warn(`expected to get number, but got`, value);
    }

    return result.filter(i => !Number.isNaN(i));
  },
  out: toCommaSplitArray.out,
};
