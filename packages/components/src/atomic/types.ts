import { NamedRegistry } from '@wakeadmin/utils';
import { ClassValue, StyleValue } from '@wakeadmin/element-adapter';

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
   * 场景值
   * 场景值给原件提供了额外的信息，从而可以提供更合理的默认行为
   */
  scene?: 'table' | 'form';

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
  class?: ClassValue;

  /**
   * 样式
   */
  style?: StyleValue;

  /**
   * 上下文信息，由具体的应用组件指定
   *
   * note: 通用原件通常不会直接耦合具体的上下文信息
   */
  context?: any;
}

/**
 * 忽略 vue v-model 相关属性
 */
export type OmitVModelProps<T extends {}> = Omit<T, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue'>;

/**
 * 忽略内置的原件 props
 */
export type OmitAtomicCommonProps<T extends {}> = OmitVModelProps<Omit<T, keyof AtomicCommonProps<any>>>;

/**
 * 定义原件属性
 */
export type DefineAtomicProps<Value, Props extends {}, Extra extends {} = {}> = AtomicCommonProps<Value> &
  OmitAtomicCommonProps<Props> &
  Extra & {
    /**
     * slots 透传
     */
    'v-slots'?: Record<string, any>;
  };

/**
 * 原子组件协议
 */
export interface Atomic<T = any, P extends AtomicCommonProps<T> = AtomicCommonProps<T>> {
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
   * 是否为 只预览模式
   */
  previewOnly?: boolean;

  /**
   * 组件实现, 就是一个渲染函数
   */
  component: (props: P) => any;

  /**
   * 值验证
   * @param {T} value 当前值
   * @param {any} context 上下文，可以获取到其他字段的值
   * 验证失败抛出异常
   */
  validate?: (value: any, props: P, context: any) => Promise<void>;

  /**
   * 尝试对给定值进行转换，转换为组件能够识别的格式
   */
  convert?: (originalValue: any) => T;
}

export interface Registry extends Pick<NamedRegistry<Atomic>, 'register' | 'unregister' | 'subscribe' | 'unsubscribe'> {
  registered(name: string): Atomic | undefined;
}
