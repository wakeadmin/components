import { InjectionKey, provide, inject } from '@wakeadmin/demi';

export interface FatFormStepStatus {
  index: number;
  active: boolean;
}

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
  renderStep(status: FatFormStepStatus): any;

  /**
   * 表单内容
   */
  renderForm(status: FatFormStepStatus): any;

  /**
   * 是否包含了 FatFormSection
   */
  readonly hasSections: boolean;
}

export interface FatFormStepsContextValue {
  /**
   * 注册 steps 实例
   * @param instance
   * @returns 返回 disposer 用于解除注册
   */
  register(instance: FatFormStepMethods): () => void;
}

const Context: InjectionKey<FatFormStepsContextValue> = Symbol('fat-form-step-context');

export function provideFatFormStepsContext(value: FatFormStepsContextValue) {
  provide(Context, value);
}

export function useFatFormStepsContext() {
  return inject(Context);
}
