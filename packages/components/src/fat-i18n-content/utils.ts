import { FatI18nDesc } from './types';
import memoize from 'lodash/memoize';

const DEFAULT_PLACEHOLDER = '{default}';
const UUID_PLACEHOLDER = '{uuid}';

export const formatToMatcher = memoize((format: string) => {
  const indexOfDefault = format.indexOf(DEFAULT_PLACEHOLDER);
  const indexOfUUID = format.indexOf(UUID_PLACEHOLDER);

  if (indexOfDefault === -1 || indexOfUUID === -1) {
    throw new Error(`format 必须包含 {default} 和 {uuid}`);
  }

  // named capture 在 es2018 之后才支持，为了向下兼容，这里就不使用 named capture 了
  const groupOfDefault = indexOfDefault < indexOfUUID ? 1 : 2;
  const groupOfUUID = indexOfDefault < indexOfUUID ? 2 : 1;

  const group = '([\\s\\S]+?)';
  const groupOptional = '([\\s\\S]*?)';

  let normalizedFormat = format
    .replace(DEFAULT_PLACEHOLDER, '____default____')
    .replace(UUID_PLACEHOLDER, '____uuid____')
    .replace(/([\^$()[\]{}<>])/g, '\\$1')
    .replace('____default____', groupOptional)
    .replace('____uuid____', group);

  const regexp = new RegExp(normalizedFormat, 'm');

  const match = (content: string) => {
    if (!content) {
      return {
        default: content,
      };
    }

    const result = regexp.exec(content);
    if (result == null) {
      return {
        default: content,
      };
    }

    return {
      default: result[groupOfDefault],
      uuid: result[groupOfUUID]?.trim(),
    };
  };

  return {
    format: normalizedFormat,
    regexp,
    match,
  };
});

export const formatToReplacer = memoize((format: string) => {
  const indexOfDefault = format.indexOf(DEFAULT_PLACEHOLDER);
  const indexOfUUID = format.indexOf(UUID_PLACEHOLDER);

  if (indexOfDefault === -1 || indexOfUUID === -1) {
    throw new Error(`format 必须包含 {default} 和 {uuid}`);
  }

  const replacer = (desc: FatI18nDesc) => {
    if (desc.uuid == null) {
      return desc.default;
    }

    return format.replace(DEFAULT_PLACEHOLDER, desc.default).replace(UUID_PLACEHOLDER, desc.uuid);
  };

  return replacer;
});

/**
 * 解析占位符
 * @param content
 * @param format
 * @param parser
 * @returns
 */
export function parse(content: string, format?: string, parser?: (content: string) => FatI18nDesc): FatI18nDesc {
  if (typeof parser === 'function') {
    return parser(content);
  }

  if (format == null) {
    throw new Error('format 不能为空');
  }

  const matcher = formatToMatcher(format);
  return matcher.match(content);
}

/**
 * 序列化为占位符
 * @param desc
 * @param format
 * @param serializer
 */
export function serialize(desc: FatI18nDesc, format?: string, serializer?: (desc: FatI18nDesc) => string): string {
  if (typeof serializer === 'function') {
    return serializer(desc);
  }

  if (format == null) {
    throw new Error('format 不能为空');
  }

  if (desc.uuid == null) {
    return desc.default;
  }

  const replacer = formatToReplacer(format);

  return replacer(desc);
}

export function toPromiseFunction<T>(fn: T | (() => Promise<T>)): () => Promise<T> {
  return (typeof fn === 'function' ? fn : () => Promise.resolve(fn)) as any;
}
