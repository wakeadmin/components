import { MessageType } from './message-box';

/** Message Component */
export declare class MessageMethods {
  /** Close the Loading instance */
  close(): void;
}

/**
 * Triggers when a message is being closed
 *
 * @param instance The message component that is being closed
 */
export type MessageCloseEventHandler = (instance: MessageMethods) => void;

/** Options used in Message */
export interface MessageOptions {
  /** Message text */
  message: string | any;

  /** Message type */
  type?: MessageType;

  /** Custom icon's class, overrides type */
  iconClass?: string;

  /** Custom class name for Message */
  customClass?: string;

  /** Display duration, millisecond. If set to 0, it will not turn off automatically */
  duration?: number;

  /** Whether to show a close button */
  showClose?: boolean;

  /** Whether to center the text */
  center?: boolean;

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean;

  /** Callback function when closed with the message instance as the parameter */
  onClose?: MessageCloseEventHandler;

  /** Set the distance to the top of viewport. Default is 20 px. */
  offset?: number;
}

export interface MessageInstance {
  /** Show an info message */
  (text: string): MessageMethods;

  /** Show message */
  (options: MessageOptions): MessageMethods;

  /** Show a success message */
  success(text: string): MessageMethods;

  /** Show a success message with options */
  success(options: MessageOptions): MessageMethods;

  /** Show a warning message */
  warning(text: string): MessageMethods;

  /** Show a warning message with options */
  warning(options: MessageOptions): MessageMethods;

  /** Show an info message */
  info(text: string): MessageMethods;

  /** Show an info message with options */
  info(options: MessageOptions): MessageMethods;

  /** Show an error message */
  error(text: string): MessageMethods;

  /** Show an error message with options */
  error(options: MessageOptions): MessageMethods;
}

export const Message: MessageInstance;
