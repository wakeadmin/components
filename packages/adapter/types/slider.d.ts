export type SliderTooltipFormat = (value: number) => string;

/** Slider Component */
export interface SliderProps {
  /** Current value of the slider */
  // vue2 v-model
  value?: number | [number, number];
  onInput?: (value: number | [number, number]) => void;
  onChange?: (value: number | [number, number]) => void;

  // vue3 v-model

  modelValue?: number | [number, number];
  'onUpdate:modelValue'?: (value: number | [number, number]) => void;

  /** Minimum value */
  min?: number;

  /** Maximum value */
  max?: number;

  /** Whether Slider is disabled */
  disabled?: boolean;

  /** Step size */
  step?: number;

  /** Whether to display an input box, works when range is false */
  showInput?: boolean;

  /** Whether to display control buttons when show-input is true */
  showInputControls?: boolean;

  /** Size of the input box */
  inputSize?: string;

  /** Whether to display breakpoints */
  showStops?: boolean;

  /** Whether to display tooltip value */
  showTooltip?: boolean;

  /** Format of displayed tooltip value */
  formatTooltip?: SliderTooltipFormat;

  /** Whether to select a range */
  range?: boolean;

  /** Vertical mode */
  vertical?: boolean;

  /** Slider height, required in vertical mode */
  height?: boolean;

  /** Debounce delay when typing, in milliseconds, works when show-input is true */
  debounce?: number;

  /** Custom class name for the tooltip */
  tooltipClass?: string;

  /** Custom marks */
  marks?: {
    [key: number]: string | { style: object; label: string | VNode };
  };
}

export const Slider: (props: SliderProps) => any;
