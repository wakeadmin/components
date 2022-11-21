export type TabType = 'card' | 'border-card';
export type TabPosition = 'top' | 'right' | 'bottom' | 'left';

/** Divide data collections which are related yet belong to different types */
export interface TabsProps {
  /** Name of the selected tab */
  // vue 2 v-model
  value?: string | number;
  onInput?: (value: string | number) => void;

  // vue 3 v-model
  modelValue?: string | number;
  'onUpdate:modelValue'?: (value: string | number) => void;

  /** Type of Tab */
  type?: TabType;

  /** Whether Tab is closable */
  closable?: boolean;

  /** Whether Tab is addable */
  addable?: boolean;

  /** Whether Tab is addable and closable */
  editable?: boolean;

  /** Position of tabs */
  tabPosition?: TabPosition;

  /** Whether width of tab automatically fits its container */
  stretch?: Boolean;

  /** Hook function before switching tab. If false or a Promise is returned and then is rejected, switching will be prevented */
  beforeLeave?: (activeName: string, oldActiveName: string) => boolean | Promise<any>;

  // events
  // TODO: 补全 pane 类型
  onTabClick?: (pane: any) => void;
  // vue 3 only
  onTabChange?: (name: string | number) => void;
  onTabRemove?: (name: string | number) => void;
  onTabAdd?: () => void;
  onEdit?: (name: string | number | undefined, action: 'remove' | 'add') => void;
}

/** Tab Pane Component */
export interface TabPaneProps {
  /** Title of the tab */
  label?: string;

  /** Whether Tab is disabled */
  disabled?: boolean;

  /** Identifier corresponding to the activeName of Tabs, representing the alias of the tab-pane */
  name?: string | number;

  /** Whether Tab is closable */
  closable?: boolean;

  /** Whether Tab is lazily rendered */
  lazy?: boolean;
}

export const Tabs: (props: TabsProps) => any;
export const TabPane: (props: TabPaneProps) => any;
