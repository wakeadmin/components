export type MessageType = 'success' | 'warning' | 'info' | 'error';
export type MessageBoxCloseAction = 'confirm' | 'cancel' | 'close';
export type MessageBoxData = MessageBoxInputData | MessageBoxCloseAction;

export interface MessageBoxInputData {
  value: string;
  action: MessageBoxCloseAction;
}

export type MessageBoxInputValidator = (value: string) => boolean | string;

/** Options used in MessageBox */
export interface MessageBoxOptions {
  /** Title of the MessageBox */
  title?: string;

  /** Content of the MessageBox */
  message?: string | any;

  /** Message type, used for icon display */
  type?: MessageType;

  /** Custom icon's class */
  iconClass?: string;

  /** Custom class name for MessageBox */
  customClass?: string;

  /** MessageBox closing callback if you don't prefer Promise */
  callback?: (action: MessageBoxCloseAction, instance: any) => void;

  /** Callback before MessageBox closes, and it will prevent MessageBox from closing */
  beforeClose?: (action: MessageBoxCloseAction, instance: any, done: () => void) => void;

  /** Whether to lock body scroll when MessageBox prompts */
  lockScroll?: boolean;

  /** Whether to show a cancel button */
  showCancelButton?: boolean;

  /** Whether to show a confirm button */
  showConfirmButton?: boolean;

  /** Whether to show a close button */
  showClose?: boolean;

  /** Text content of cancel button */
  cancelButtonText?: string;

  /** Text content of confirm button */
  confirmButtonText?: string;

  /** Custom class name of cancel button */
  cancelButtonClass?: string;

  /** Custom class name of confirm button */
  confirmButtonClass?: string;

  /** Whether to align the content in center */
  center?: boolean;

  /** Whether message is treated as HTML string */
  dangerouslyUseHTMLString?: boolean;

  /** Whether to use round button */
  roundButton?: boolean;

  /** Whether MessageBox can be closed by clicking the mask */
  closeOnClickModal?: boolean;

  /** Whether MessageBox can be closed by pressing the ESC */
  closeOnPressEscape?: boolean;

  /** Whether to close MessageBox when hash changes */
  closeOnHashChange?: boolean;

  /** Whether to show an input */
  showInput?: boolean;

  /** Placeholder of input */
  inputPlaceholder?: string;

  /** Initial value of input */
  inputValue?: string;

  /** Regexp for the input */
  inputPattern?: RegExp;

  /** Input Type: text, textArea, password or number */
  inputType?: string;

  /** Validation function for the input. Should returns a boolean or string. If a string is returned, it will be assigned to inputErrorMessage */
  inputValidator?: MessageBoxInputValidator;

  /** Error message when validation fails */
  inputErrorMessage?: string;

  /** Whether to distinguish canceling and closing */
  distinguishCancelAndClose?: boolean;
}

export interface MessageBoxShortcutMethod {
  (message: string, title: string, options?: MessageBoxOptions, context?: any): Promise<MessageBoxData>;
  (message: string, options?: MessageBoxOptions, context?: any): Promise<MessageBoxData>;
}

export interface MessageBoxInstance {
  /** Show a message box */
  (message: string, title?: string, type?: string, context?: any): Promise<MessageBoxData>;

  /** Show a message box */
  (options: MessageBoxOptions, context?: any): Promise<MessageBoxData>;

  /** Show an alert message box */
  alert: MessageBoxShortcutMethod;

  /** Show a confirm message box */
  confirm: MessageBoxShortcutMethod;

  /** Show a prompt message box */
  prompt: MessageBoxShortcutMethod;

  /** Set default options of message boxes */
  setDefaults(defaults: MessageBoxOptions): void;

  /** Close current message box */
  close(): void;
}

export const MessageBox: MessageBoxInstance;
