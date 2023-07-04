import { FatFormItemMapper } from '../fat-form';

export const numberToString: FatFormItemMapper = {
  in(value: unknown) {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'string' && value !== '') {
      return Number(value);
    }

    if (value != null && process.env.NODE_ENV !== 'production') {
      console.warn(`expected to get string number, but got`, value);
    }
  },
  out(value: unknown) {
    if (value != null) {
      return String(value);
    }
  },
};
