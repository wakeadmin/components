import { FunctionalComponent, CSSProperties } from '@wakeadmin/demi';
import { NamedRegistry } from '@wakeadmin/utils';

declare global {
  // 定义原件的 props 映射
  // key 为 atomic 名称
  // value 为 props 类型, 除 AtomicCommonProps 之外的字段
  interface AtomicProps {}
}

/**
 * 通用的组件选项
 */
export interface AtomicCommonProps<T> {
  /**
   * 渲染模式
   */
  mode?: 'editable' | 'preview';

  /**
   * 是否已禁用
   */
  disabled?: boolean;

  /**
   * 字段值
   */
  value?: T;

  /**
   * 字段变化
   */
  onChange?: (value?: T) => void;

  /**
   * 类名
   */
  class?: string;

  /**
   * 样式
   */
  style?: CSSProperties;

  /**
   * 上下文信息，由具体的应用组件指定
   */
  context?: any;
}

/**
 * 原子组件协议
 */
export interface Atomic {
  /**
   * 名称，小写驼峰式, 需要避免和其他组件冲突
   */
  name: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 原件作者
   */
  author?: string;

  /**
   * 组件实现
   */
  component: FunctionalComponent<AtomicCommonProps<any>>;

  /**
   * 值验证
   * @param {T} value 当前值
   * @param {any} context 上下文，可以获取到其他字段的值
   */
  validate?: (value: any, context: any) => Promise<void>;
}

export interface Registry extends Pick<NamedRegistry<Atomic>, 'register' | 'unregister' | 'subscribe' | 'unsubscribe'> {
  registered(name: string): Atomic | undefined;
}
