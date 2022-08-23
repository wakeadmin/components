import {
  ClassValue,
  ColProps,
  FormMethods,
  RowProps,
  Size,
  StyleValue,
  Rule,
  Rules,
} from '@wakeadmin/component-adapter';

import { Atomic } from '../atomic';

/**
 * 参考 antd-pro https://procomponents.ant.design/components/field-set#%E5%AE%BD%E5%BA%A6
 */
export type FatFormWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * 表单模式
 */
export type FatFormMode = 'preview' | 'editable';

/**
 * fat 表单实例方法
 */
export interface FatFormMethods<S> {
  /**
   * 表单模式
   */
  readonly mode: FatFormMode;

  /**
   * 是否已经营
   */
  readonly disabled: boolean;

  /**
   * 错误信息
   */
  readonly error?: Error;

  /**
   * 正在加载中
   */
  readonly loading: boolean;

  /**
   * 表单提交中
   */
  readonly submitting: boolean;

  /**
   * 表单值
   */
  values: S;

  /**
   * 底层 form 实例
   */
  readonly formRef?: FormMethods;

  /**
   * 表单提交
   */
  submit(): Promise<void>;

  /**
   * 手动发起请求, 当 requestOnMounted 关闭时使用
   */
  request(): Promise<void>;

  /**
   * 重置表单
   */
  reset(): void;

  /**
   * 对整个表单的内容进行验证。返回 boolean 表示是否验证通过
   *
   * 注意： 和 element-ui 不一样的是，这个验证通过不会抛出异常
   */
  validate: () => Promise<boolean>;

  /**
   * 验证某个字段
   */
  validateField: (props: string | string[]) => Promise<boolean>;

  /**
   * 检查对应字段是否被用户操作过
   * @param allTouched 如果传递多个 prop, allTouched 用于控制是否所有字段都 touch 了才返回true。默认为 true
   */
  isFieldTouched: (props: string | string[], allTouched?: boolean) => boolean;

  /**
   * 清除表单验证
   */
  clearValidate: (props: string | string[]) => void;

  /**
   * 获取指定字段的值
   * @param prop
   */
  getFieldValue(prop: string): any;

  /**
   * 设置指定字段的值
   * @param prop
   * @param value
   */
  setFieldValue(prop: string, value: any): void;

  // 以下是私有方法

  /**
   * 设置字段值，prop 为字段路径，同 FatFormItemProps
   *
   * 这个方法用于初始化 prop，在 vue2 中这是必须的，否则对象无法响应
   *
   * @param prop
   * @param value 初始值，可选
   */
  __setInitialValue(prop: string, value?: any): void;
}

/**
 * fat 表单事件
 */
export interface FatFormEvents<S> {
  /**
   * 加载成功时触发
   */
  onLoad?: (values: S) => void;

  /**
   * 数据提交完成时触发
   */
  onFinish?: (values: S) => void;

  /**
   * 提交失败时触发
   */
  onSubmitFailed?: (values: S, error: Error) => void;

  /**
   * 任一表单项被校验后触发
   */
  onValidate?: (prop: string, isValid: boolean, message: string) => void;

  /**
   * 数据验证失败时触发
   */
  onValidateFailed?: (values: S) => void;

  /**
   * 数据变更时触发
   */
  onValuesChange?: (values: S) => void;

  /**
   * 表单重置时触发
   */
  onReset?: () => void;
}

/**
 * fat 表单属性
 * @template S 表单类型
 */
export interface FatFormProps<S extends {} = {}> extends FatFormEvents<S> {
  /**
   * 使用场景
   * preview 预览
   * editable 编辑
   *
   * 默认为 editable
   */
  mode?: FatFormMode;

  /**
   * 初始化值, 表单默认值，只有初始化(比如新建场景)以及重置时生效
   */
  initialValue?: S;

  /**
   * 数据请求。用于预览、编辑场景
   */
  request?: () => Promise<S>;

  /**
   * 是否在挂在的时候就发起请求, 默认为 true
   *
   * 在新增场景可以关闭
   */
  requestOnMounted?: boolean;

  /**
   * 表单提交
   */
  submit?: (values: S) => Promise<void>;

  /**
   * 表单布局， 默认为 horizontal
   */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /**
   * label 水平对齐方式， 默认 right
   */
  labelAlign?: 'left' | 'right';

  /**
   * 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto
   *
   * 默认为 'auto'
   */
  labelWidth?: string | number;

  /**
   * 表单域标签的后缀, 默认 '：'
   */
  labelSuffix?: string;

  /**
   * 用于控制该表单内组件的尺寸
   */
  size?: Size;

  /**
   * 是否禁用该表单内的所有组件。若设置为 true，则表单内组件上的 disabled 属性不再生效
   */
  disabled?: false;

  /**
   * 验证规则
   */
  rules?: Rules | ((values: S, form: FatFormMethods<S>) => Rules);

  // TODO: 其他 el-form 属性
}

/**
 * fat 表单分组属性
 */
export interface FatFormGroupProps {
  /**
   * 标题, 支持字符串或 jsx，也可以使用 renderTitle 或者 title slot
   */
  title?: any;

  renderTitle?: () => any;

  /**
   * 间隔大小
   */
  gutter?: number | string;

  /**
   * 是否作为 el-row
   */
  rowProps?: RowProps | boolean;
}

/**
 * 用于获取表单实例，实现一些表单联动的场景
 */
export interface FatFormConsumerProps<S extends {} = {}> {
  /**
   * 也可以通过 #default slot
   */
  renderDefault?: (form: FatFormMethods<S>) => any;
}

export interface FatFormItemMethods<S extends {}> {
  readonly form: FatFormMethods<S>;
  readonly value: any;
  readonly prop: string;
  readonly props: FatFormItemProps<S, any>;
  readonly disabled: boolean;
}

/**
 * fat 表单项属性
 */
export interface FatFormItemProps<S extends {}, K extends keyof AtomicProps | Atomic> {
  /**
   * 显式指定字段的模式。适用于编辑模式下，某些字段禁止编辑的场景
   */
  mode?: FatFormMode;

  /**
   * 标签, 也可以使用 label slot 或 renderLabel
   */
  label?: any;

  /**
   * 自定义标签渲染
   */
  renderLabel?: (inst: FatFormItemMethods<S>) => any;

  /**
   * 表单域标签的的宽度，例如 '50px'。支持 auto
   */
  labelWidth?: string;

  /**
   * 会在 label 右侧增加一个 icon，悬浮后提示信息. 支持 jsx
   */
  tooltip?: any;

  /**
   * 在表单下方展示提示信息
   */
  message?: any;

  /**
   * 字段路径。例如 a.b.c
   */
  prop: string;

  /**
   * 字段初始值
   *
   * note: 如果与 Form 的 initialValues 冲突则以 Form 为准
   */
  initialValue?: any;

  /**
   * 原件类型, 默认为 text
   */
  valueType?: K;

  /**
   * 原件属性
   */
  valueProps?: K extends keyof AtomicProps ? AtomicProps[K] : K extends Atomic<any, infer B> ? B : Record<string, any>;

  /**
   * 验证规则
   */
  rules?: Rule | ((values: S, form: FatFormMethods<S>) => Rule);

  /**
   * 网格列配置
   * 如果配置了该项， 会使用 el-col 包裹
   */
  colProps?: ColProps;

  /**
   * 字段宽度(不包含label)
   */
  width?: number | FatFormWidth;

  /**
   * 是否隐藏
   *
   * 隐藏后当前字段将不会进行校验
   */
  hidden?: boolean | ((instance: FatFormItemMethods<S>) => boolean);

  /**
   * 是否禁用
   *
   * 禁用后当前字段将不会进行校验
   */
  disabled?: boolean | ((instance: FatFormItemMethods<S>) => boolean);

  /**
   * 表单大小, 会覆盖 FatForm 指定的大小
   */
  size?: Size;

  /**
   * 声明该字段依赖的字段，格式同 prop
   * 当列表中的字段变更后，通知当前字段进行重新验证
   */
  dependencies?: string[] | string;

  /**
   * 原件类名
   */
  atomicClassName?: ClassValue;

  /**
   * 原件内联样式
   */
  atomicStyle?: StyleValue;

  // TODO: 插槽
  renderBefore?: () => any;
  renderChildren?: () => any;
}

export { Rules, Rule } from '@wakeadmin/component-adapter';