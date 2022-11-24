import { TabPaneProps, TabsProps, ButtonProps, CommonProps } from '@wakeadmin/element-adapter';
import { FatFormBaseProps, FatFormEvents, FatFormMethods, FatFormSlots } from '../../fat-form';

export type FatFormTabsMethods<
  Store extends {} = {},
  Request extends {} = Store,
  Submit extends {} = Store
> = FatFormMethods<Store, Request, Submit>;

export type FatFormTabsSlots<Store extends {}> = FatFormSlots<Store>;

export interface FatFormTabsEvents<Store extends {} = {}, Submit extends {} = Store>
  extends FatFormEvents<Store, Submit> {
  onActiveChange?: (nextActive?: string | number) => void;

  /**
   * 点击取消事件
   */
  onCancel?: () => void;
}

export interface FatFormTabsProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormBaseProps<Store, Request, Submit>,
    FatFormTabsEvents<Store, Submit>,
    FatFormTabsSlots<Store> {
  tabsProps?: Omit<TabsProps, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue'> & CommonProps;

  /**
   * 自定义布局
   */
  pageLayout?: FatFormTabsLayout;

  /**
   * 传递给自定义布局的参数
   */
  layoutProps?: any;

  /**
   * 初始激活的标签
   */
  initialActive?: string | number;

  /**
   * 是否开启取消按钮, 默认开启
   */
  enableCancel?: boolean;

  /**
   * 取消按钮文本， 默认为取消
   */
  cancelText?: string;

  /**
   * 自定义取消 props
   */
  cancelProps?: ButtonProps;

  /**
   * 点击取消前调用，默认行为是返回上一页。调用 done 可以执行默认行为
   */
  beforeCancel?: (done: () => void) => void;

  /**
   * 表单验证失败处理
   */
  validateErrorCapture?: (name: string | number, error: Error) => void;
}

export interface FatFormTabPaneSlots {
  renderLabel?: () => any;
}

export interface FatFormTabPaneProps extends Omit<TabPaneProps, 'name'>, FatFormTabPaneSlots {
  /**
   * name 必填, 唯一标签
   */
  name: string | number;
}

/**
 * 自定义布局
 */
export type FatFormTabsLayout = (renderers: {
  /**
   * 自定义布局参数透传
   */
  readonly layoutProps: any;

  /**
   * 表单实例
   */
  form: FatFormTabsMethods<any>;

  /**
   * 提交器渲染, 当 submitter 关闭时为 undefined
   */
  renderSubmitter?: () => any;

  /**
   * Tabs 主体渲染
   */
  renderTabs(): any;
}) => any;
