import { PopoverPlacement } from './popover';

export type TooltipEffect = 'dark' | 'light';

/** Tooltip Component */
export interface TooltipProps {
  /** Tooltip theme */
  effect?: TooltipEffect;

  /** Display content, can be overridden by slot#content */
  content?: string;

  /** Position of Tooltip */
  placement?: PopoverPlacement;

  /** Visibility of Tooltip */
  // vue2 v-model
  value?: boolean;
  onInput?: (value: boolean) => void;

  // vue3 v-model
  visible?: boolean;
  'onUpdate:visible'?: (value: boolean) => void;

  /** Whether Tooltip is disabled */
  disabled?: boolean;

  /** Offset of the Tooltip */
  offset?: number;

  /** Animation name */
  transition?: string;

  /** Whether an arrow is displayed. For more information, check Vue-popper page */
  visibleArrow?: boolean;

  /** Whether to control Tooltip manually. mouseenter and mouseleave won't have effects if set to true */
  manual?: boolean;

  /** Custom class name for Tooltip's popper */
  popperClass?: string;

  /** Whether the mouse can enter the tooltip	 */
  enterable?: string;
}

export const Tooltip: (props: TooltipProps) => any;
