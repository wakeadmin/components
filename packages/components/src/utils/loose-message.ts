import { MessageBoxOptions, MessageOptions } from '@wakeadmin/element-adapter';

export type LooseMessageBoxOptions<Args extends {}> =
  | boolean
  | string
  | MessageBoxOptions
  | ((args: Args) => MessageBoxOptions)
  | undefined;

export type LooseMessageOptions<Args extends {}> =
  | boolean
  | string
  | MessageOptions
  | ((args: Args) => MessageOptions)
  | undefined;

/**
 * 构造确认框信息
 * @param options
 * @param defaultOptions
 * @param args
 * @returns
 */
export function createMessageBoxOptions<Args extends {}>(
  options: LooseMessageBoxOptions<Args>,
  defaultOptions: Partial<MessageBoxOptions>,
  args: Args
): MessageBoxOptions | undefined {
  if (options === false) {
    return undefined;
  }

  const clone = { ...defaultOptions };

  if (typeof options === 'string') {
    clone.message = options;
  }

  if (typeof options === 'function') {
    Object.assign(clone, options(args));
  } else if (options && typeof options === 'object') {
    Object.assign(clone, options);
  }

  return clone;
}

/**
 * 构造消息框信息
 * @param options
 * @param defaultOptions
 * @param args
 * @returns
 */
export function createMessageOptions<Args extends {}>(
  options: LooseMessageOptions<Args>,
  defaultOptions: Partial<MessageOptions>,
  args: Args
): MessageOptions | undefined {
  if (options === false) {
    return undefined;
  }

  const clone = { ...defaultOptions };

  if (typeof options === 'string') {
    clone.message = options;
  }

  if (typeof options === 'function') {
    Object.assign(clone, options(args));
  } else if (options && typeof options === 'object') {
    Object.assign(clone, options);
  }

  return clone as MessageOptions;
}
