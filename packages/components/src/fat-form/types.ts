import { ColProps, FormMethods, RowProps, Size } from '@wakeadmin/component-adapter';
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
   * 重置表单
   */
  reset(): void;

  /**
   * 对整个表单的内容进行验证。返回 boolean 表示是否验证通过
   * 注意： 和 element-ui 不一样的是，这个验证通过不会抛出异常
   */
  validate: () => Promise<boolean>;

  /**
   * 验证某个字段
   */
  validateField: (props: string | string[]) => Promise<boolean>;

  /**
   * 清除表单验证
   */
  clearValidate: (props: string | string[]) => void;
}

/**
 * fat 表单事件
 */
export interface FatFormEvents<S> {
  /**
   * 数据提交时触发
   */
  onFinish?: (values: S) => Promise<void>;

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
   * 表单布局， 默认为 horizontal
   */
  layout?: 'horizontal' | 'vertical' | 'inline';

  /**
   * label 水平对齐方式， 默认 right
   */
  labelAlign?: 'left' | 'right';

  /**
   * 标签的长度，例如 '50px'。 作为 Form 直接子元素的 form-item 会继承该值。 可以使用 auto
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
export interface FatFormConsumer<S extends {} = {}> {
  renderChildren?: (form: FatFormMethods<S>) => any;
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
  renderLabel?: () => any;

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
  prop?: string;

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
   * TODO: 完善类型
   */
  rules?: any;

  /**
   * 网格列配置
   * 如果配置了该项， 会使用 el-col 包裹
   */
  colProps?: ColProps;

  /**
   * 字段宽度
   */
  width?: number | FatFormWidth;

  /**
   * 是否禁用
   *
   * 禁用后当前字段将不会进行校验
   */
  disabled?: boolean | ((instance: FatFormMethods<S>) => boolean);

  /**
   * 表单大小, 会覆盖 FatForm 指定的大小
   */
  size?: Size;

  /**
   * 声明该字段依赖的字段，格式同 prop
   * 当列表中的字段变更后，通知当前字段进行重新验证
   */
  dependencies?: string[];

  // TODO: 插槽
  renderBefore?: () => any;
  renderChildren?: () => any;
}
