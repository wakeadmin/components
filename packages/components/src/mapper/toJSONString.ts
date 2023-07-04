import { FatFormItemMapper } from '../fat-form';

/**
 * 转换为 JSON 字符串
 */
export const toJSONArrayString: FatFormItemMapper = {
  in(value: unknown) {
    if (!value) {
      return [];
    }

    try {
      const result = JSON.parse(value as string);

      if (process.env.NODE_ENV !== 'production' && !Array.isArray(result)) {
        console.warn(`expected to get array, but got`, value);
      }

      return result;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`failed to parse value to JSON: `, value);
      }

      return [];
    }
  },
  out(value: unknown) {
    if (!value) {
      return '';
    }
    return JSON.stringify(value);
  },
};

export const toJSONObjectString: FatFormItemMapper = {
  in(value: unknown) {
    if (!value) {
      return {};
    }

    try {
      const result = JSON.parse(value as string);

      if (process.env.NODE_ENV !== 'production' && typeof result !== 'object') {
        console.warn(`expected to get object, but got`, value);
      }

      return result;
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`failed to parse value to JSON: `, value);
      }

      return {};
    }
  },
  out(value: unknown) {
    if (!value) {
      return '';
    }
    return JSON.stringify(value);
  },
};
