export type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success';

/** Step Component */
export interface StepProps {
  /** Step title */
  title?: string;

  /** Step description, 也支持插槽 */
  description?: string;

  /** Step icon, 也支持 slot 形式传入 */
  icon?: any;

  /** Current status. It will be automatically set by Steps if not configured. */
  status?: StepStatus;
}

export interface StepSlots {
  /** Custom icon */
  icon: () => any;

  /** Step title */
  title: () => any;

  /** Step description */
  description: () => any;
}

/**
 * 步骤项
 */
export const Step: new (props: StepProps) => { $props: StepProps; $slots: StepSlots };

export type StepsDirection = 'vertical' | 'horizontal';

/** Guide the user to complete tasks in accordance with the process. Its steps can be set according to the actual application scenario and the number of the steps can't be less than 2. */
export interface StepsProps {
  /** The spacing of each step, will be responsive if omitted. Support percentage. */
  space?: number | string;

  /** Display direction */
  direction?: StepsDirection;

  /** Current activation step */
  active?: number;

  /** Status of current step */
  processStatus?: StepStatus;

  /** Status of end step */
  finishStatus?: StepStatus;

  /** Whether step description is centered */
  alignCenter?: boolean;

  /** Whether to apply simple theme */
  simple?: boolean;
}

/**
 * 步骤容器
 */
export const Steps: (props: StepsProps) => any;
