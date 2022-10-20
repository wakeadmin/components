import { NamedRegistry } from '@wakeadmin/utils';
import { ClassValue, StyleValue } from '@wakeadmin/element-adapter';

declare global {
  // 定义原件的 props 映射
  // key 为 atomic 名称
  // value 为 props 类型, 除 AtomicCommonProps 之外的字段
  interface AtomicProps {}
}

/**
 * 预定义的上下文基础信息
 */
export interface BaseAtomicContext {
  /**
   * 原件关联的标签信息
   */
  label?: string;

  /**
   * 原件关联的属性路径
   */
  prop?: string;

  /**
   * 原件所在的容器
   */
  values?: unknown;

  // 其他属性由实现者自定义
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
  context?: BaseAtomicContext;
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
   * 名称，kebab-case, 需要避免和其他组件冲突
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
   * 是否为 只预览模式。可以提示组件实现者，在编辑模式下隐藏该原件
   */
  previewOnly?: boolean;

  /**
   * 是否为 只编辑模式。可以提示组件实现者，在预览模式下隐藏该原件
   */
  editOnly?: boolean;

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
   * 验证触发的时机
   */
  validateTrigger?: 'change' | 'blur';

  /**
   * 尝试对给定值进行转换，转换为组件能够识别的格式
   */
  convert?: (originalValue: any) => T;
}

export interface Registry extends Pick<NamedRegistry<Atomic>, 'register' | 'unregister' | 'subscribe' | 'unsubscribe'> {
  registered(name: string): Atomic | undefined;
}

/**
 * 获取原件的类型
 */
export type GetAtomicProps<Type extends keyof AtomicProps | Atomic> = Type extends keyof AtomicProps
  ? AtomicProps[Type]
  : Type extends Atomic<any, infer B>
  ? B
  : Record<string, any>;

/**
 * 组合所有内置原件属性
 * 实验性。Typescript 支持不是很好，暂时不能用
 */
export type WithAtomics<Share extends {}> = keyof {
  // @ts-expect-error
  [A in keyof AtomicProps as A extends 'text'
    ? { valueType?: 'text' | undefined; valueProps?: AtomicProps['text'] } & Share
    : {
        valueType: A;
        valueProps?: AtomicProps[A];
      } & Share]: any;
};
