import { TooltipEffect } from './tooltip';

export type PopoverTrigger = 'click' | 'focus' | 'hover' | 'manual';
export type PopoverPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface PopoverProps {
  /** How the popover is triggered */
  trigger: PopoverTrigger;

  /** Popover title */
  title: string;

  /** Popover content, can be replaced with a default slot */
  content: string;

  /** Popover width */
  width: string | number;

  /** Popover placement */
  placement: PopoverPlacement;

  /** Whether Popover is disabled */
  disabled: boolean;

  /** Popover offset */
  offset: number;

  /** Popover transition animation */
  transition: string;

  /** Parameters for popper.js */
  popperOptions: object;

  /** Custom class name for popover */
  popperClass: string;

  /** Delay before appearing when trigger is hover, in milliseconds */
  openDelay: number;

  /** Delay before disappearing when trigger is hover, in milliseconds */
  closeDelay: number;

  /** Popover tabindex */
  tabindex: number;

  /** Visibility of Tooltip */
  // vue2 v-model
  /** Whether popover is visible */
  value: boolean;
  onInput?: (value: boolean) => void;

  // vue3 v-model
  visible?: boolean;
  'onUpdate:visible'?: (value: boolean) => void;

  // vue2
  visibleArrow?: boolean;

  // vue3
  effect?: TooltipEffect;
  showArrow?: boolean;
  popperStyle?: string | object;
  showAfter?: number;
  hideAfter?: number;
  autoClose?: number;
  teleported?: boolean;
  persistent?: boolean;
}

export const Popover: (props: PopoverProps) => any;
