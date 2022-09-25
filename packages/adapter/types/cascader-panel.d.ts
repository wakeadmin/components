import { VNodeChild } from './shared';

/** Trigger mode of expanding current item */
export type CascaderExpandTrigger = 'click' | 'hover';

/** Cascader Option */
export interface CascaderOption {
  label: string;
  value: any;
  children?: CascaderOption[];
  disabled?: boolean;
  leaf?: boolean;
}

/** Cascader Props */
export interface CascaderInnerProps<V, D> {
  expandTrigger?: CascaderExpandTrigger;
  multiple?: boolean;
  checkStrictly?: boolean;
  emitPath?: boolean;
  lazy?: boolean;
  lazyLoad?: (node: CascaderNode<V, D>, resolve: Resolve<D>) => void;
  value?: string;
  label?: string;
  children?: string;
  disabled?: string;
  leaf?: string;
}

/** Cascader Node */
export interface CascaderNode<V, D> {
  uid: number;
  data: D;
  value: V;
  label: string;
  level: number;
  isDisabled: boolean;
  isLeaf: boolean;
  parent: CascaderNode<V, D> | null;
  children: CascaderNode<V, D>[];
  config: CascaderInnerProps<V, D>;
}

type Resolve<D> = (dataList?: D[]) => void;

export interface CascaderPanelSlots {
  /** Custom label content */
  default: VNodeChild;

  [key: string]: VNodeChild;
}

/** CascaderPanel Component */
export interface CascaderPanelProps<V = any, D = CascaderOption> {
  /** Selected value */
  // vue2 v-model
  value?: V | V[];
  onInput?: (value: V | V[]) => void;

  // vue3 v-model
  modelValue?: V | V[];
  'onUpdate:modelValue'?: (value: V | V[]) => void;

  /** Data of the options */
  options?: D[];

  /** Configuration options */
  props?: CascaderInnerProps<V, D>;

  /** Whether to add border */
  border?: boolean;

  /** Render function of custom label content */
  renderLabel?: (h: Function, context: { node: CascaderNode<V, D>; data: D }) => VNodeChild;

  $slots?: CascaderPanelSlots;
}

export const CascaderPanel: (props: CascaderPanelProps) => any;
