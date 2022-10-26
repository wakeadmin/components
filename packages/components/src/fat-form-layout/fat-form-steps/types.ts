import { StepsProps, ButtonProps } from '@wakeadmin/element-adapter';
import { FatFormBaseProps, FatFormMethods, FatFormSlots, FatFormEvents } from '../../fat-form';

export interface FatFormStepsSlots<Store extends {}> extends Omit<FatFormSlots<Store>, 'renderSubmitter'> {
  renderSubmitter?: (instance: FatFormStepsMethods<Store>) => any;
}

export interface FatFormStepsEvents<Store extends {}, Submit extends {} = Store> extends FatFormEvents<Store, Submit> {
  /**
   * 步骤变化
   */
  onActiveChange?: (nextActive: number) => void;
}

export interface FatFormStepsMethods<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends FatFormMethods<Store, Request, Submit> {
  /**
   * 跳转到上一步
   */
  goPrev(): Promise<void>;

  /**
   * 跳转到下一步
   */
  goNext(): Promise<void>;

  /**
   * 跳转到指定步骤
   */
  goto(index: number): Promise<void>;
}

export interface FatFormStepsSubmitter {
  /**
   * 上一步按钮文案，默认为上一步
   */
  prevText?: string;

  /**
   * 上一步按钮自定义属性
   */
  prevProps?: ButtonProps;

  /**
   * 下一步按钮文案，默认为下一步
   */
  nextText?: string;

  /**
   * 下一步按钮自定义属性
   */
  nextProps?: ButtonProps;
}

export interface FatFormStepsProps<Store extends {} = {}, Request extends {} = Store, Submit extends {} = Store>
  extends Omit<FatFormBaseProps<Store, Request, Submit>, 'request'>,
    FatFormStepsEvents<Store, Submit>,
    FatFormStepsSlots<Store>,
    Omit<StepsProps, 'active' | 'processStatus' | 'finishStatus'>,
    FatFormStepsSubmitter {
  /**
   * 初始激活的步骤，默认为 0, 也可以在 request 方法中返回
   */
  initialActive?: number;

  /**
   * 表单数据请求
   */
  request?: () => Promise<{
    /**
     * 表单值
     */
    values: Request;

    /**
     * 当前激活的步骤
     */
    active?: number;
  }>;

  /**
   * 严格模式, 即只有当前步骤的所有表单验证通过之后才能继续下一步。相反，非严格模式，
   * 步骤之间可以随意跳转，在最后提交阶段（提交按钮也会始终存在）统一验证。
   * 默认为 true
   */
  strict?: boolean;

  /**
   * 自定义布局
   */
  pageLayout?: FatFormStepsLayout;

  /**
   * 表单宽度
   */
  formWidth?: string | number;

  /**
   * 传递给布局器的自定义属性
   */
  layoutProps?: any;
}

export type FatFormStepsLayout = (renders: {
  /**
   * 布局自定义参数
   */
  readonly layoutProps: any;

  /**
   * 表单实例引用
   */
  readonly form?: FatFormStepsMethods<any>;

  /**
   * 垂直模式
   */
  readonly vertical?: boolean;

  /**
   * 下级是否包含了 FatFormSection
   */
  readonly hasSections: boolean;

  /**
   * 表单内容宽度
   */
  readonly formWidth?: number | string;

  /**
   * 渲染步骤条
   */
  renderSteps(): any;

  /**
   * 渲染表单主体
   */
  renderContent(): any;

  /**
   * 渲染提交按钮
   */
  renderSubmitter?: () => any;
}) => any;
