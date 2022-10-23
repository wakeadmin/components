/**
 * 分布表单
 */
import { StepsProps, ButtonProps } from '@wakeadmin/element-adapter';
import { FatFormBaseProps, FatFormMethods, FatFormSlots, FatFormEvents } from '../fat-form';

export type FatFormStepsSlots<Store extends {}> = FatFormSlots<Store>;

export interface FatFormStepEvents<Store extends {}, Submit extends {} = Store> extends FatFormEvents<Store, Submit> {
  /**
   * 步骤变化
   */
  onActiveChange?: (nextActive: number) => void;
}

export type FatFormStepsMethods<
  Store extends {} = {},
  Request extends {} = Store,
  Submit extends {} = Store
> = FatFormMethods<Store, Request, Submit>;

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
    FatFormStepEvents<Store, Submit>,
    FatFormStepsSlots<Store>,
    Omit<StepsProps, 'active' | 'processStatus' | 'finishStatus'>,
    FatFormStepsSubmitter {
  // TODO: layout
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
}
