import { InjectionKey, provide, inject, Ref } from '@wakeadmin/demi';

export interface FatFormStepMethods {
  /**
   * 验证方法
   */
  validate(): Promise<void>;

  /**
   * 步骤提交
   */
  beforeSubmit(value: any): Promise<void>;

  /**
   * 渲染步骤
   */
  renderStepResult?: any;

  /**
   * 表单内容
   */
  renderFormResult?: { vnode: any; hasSections: boolean };
}

export interface FatFormStepState {
  /**
   * 资源释放
   */
  disposer: () => void;
  index: Ref<number>;
  active: Ref<boolean>;
  handleClick: () => void;
}

export interface FatFormStepsContextValue {
  /**
   * 注册 steps 实例
   * @param instance
   * @returns 返回 disposer 用于解除注册
   */
  register(instance: FatFormStepMethods): FatFormStepState;
}

const Context: InjectionKey<FatFormStepsContextValue> = Symbol('fat-form-step-context');

export function provideFatFormStepsContext(value: FatFormStepsContextValue) {
  provide(Context, value);
}

export function useFatFormStepsContext() {
  return inject(Context);
}
