import { inject, InjectionKey, provide } from '@wakeadmin/demi';

export interface FatFormTabPaneMethods {
  /**
   * 数据验证
   */
  validate(): Promise<void>;

  name: string | number;

  /**
   * 渲染 tab, 垃圾 element-ui 的 tab-pane 必须是 tabs 的直接子级
   */
  renderResult: any;
}

export interface FatFormTabsContextValue {
  /**
   * 注册 tab pane 实例
   * @param ins
   */
  register(ins: FatFormTabPaneMethods): () => void;
}

const Context: InjectionKey<FatFormTabsContextValue> = Symbol('fat-form-tabs');

export function provideFatFormTabsContext(value: FatFormTabsContextValue) {
  provide(Context, value);
}

export function useFatFormTabsContext() {
  return inject(Context);
}
