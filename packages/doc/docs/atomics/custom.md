# 自定义原件

如果内置的原件无法满足你的需求，我们也支持自定义原件。

<br>
<br>

## 原件协议

```ts
export interface Atomic<T = any, P extends AtomicCommonProps<T> = AtomicCommonProps<T>> {
  /**
   * 名称，命名规范遵循 kebab-case, 需要避免和其他组件冲突
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
   * 是否为 '只预览' 模式
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
   * 验证触发的时机
   */
  validateTrigger?: 'change' | 'blur';
}
```

<br>

::: tip 命名规范

- 使用 kebab-case, 例如 date-range
- 使用名词/动名词。例如 file 取代 upload, files 取代 upload-multiple

:::

<br>
<br>
<br>

## 组件实现

`component` 是原件的实现，这是这是一个渲染函数，接收 `props` 并返回 `VNodeChild`。 **以下 props 是固定的**:

<br>
<br>

```tsx
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
```

<br>

由上可见，原件最核心的是 `mode` 以及 `value/onChange` 协议。

- `mode` 决定是以`预览模式`呈现还是`编辑模式`
- `value/onChange` 是典型的表单协议。 类似于 Vue 的 `v-model`

<br>
<br>
<br>
<br>

## 原件实现示例

以最简单的 `switch` 原件为例:

```tsx
import { ElSwitchProps, ElSwitch, globalRegistry } from 'element-plus';

import { defineAtomic, defineAtomicComponent, DefineAtomicProps } from '@wakeadmin/components';

/**
 * 定义原件 props
 */
export type ASwitchProps = DefineAtomicProps<
  // 🔴 原件的值类型，switch 在原件支持 value 为 string | number | boolean 类型
  string | number | boolean,
  // 🔴 继承的属性
  ElSwitchProps,
  // 🔴 拓展的的属性
  {
    renderPreview?: (active: boolean) => any;
    /**
     * 默认同 activeText
     */
    previewActiveText?: string;
    /**
     * 预览时 inactiveText
     */
    previewInactiveText?: string;
  }
>;

// 🔴 注册到全局的 AtomicProps 中
// 这个让 FatTable、FatForm 在使用时可以从 valueType 推断出 valueProps 的类型
declare global {
  interface AtomicProps {
    switch: ASwitchProps;
  }
}

// 🔴 组件实现, 类似于 defineComponent
export const ASwitchComponent = defineAtomicComponent(
  (props: ASwitchProps) => {
    // 这里可以放置 Composition API

    // 返回 JSX.Element
    return () => {
      const { value, mode, onChange, context, scene, renderPreview, ...other } = props;

      const activeValue = other.activeValue ?? true;
      const active = value === activeValue;
      const activeText = other.previewActiveText ?? other.activeText ?? '开启';
      const inactiveText = other.previewInactiveText ?? other.inactiveText ?? '关闭';

      // 预览模式
      if (mode === 'preview') {
        return renderPreview ? renderPreview(active) : <span>{active ? activeText : inactiveText}</span>;
      }

      // 编辑模式
      return <ElSwitch {...other} {...model(value, onChange!)} />;
    };
  },
  { name: 'ASwitch' }
);

// 🔴 注册
globalRegistry.register({
  name: 'switch',
  component: ASwitchComponent,
  description: '开关',
  author: 'ivan-lee',
});
```

<br>
<br>
<br>

如果想深入了解自定义原件的开发细节，可以参考内置原件的实现。

<br>
<br>
<br>
<br>

## 使用自定义原件

使用`自定义原件`两种方式:

1. 如果使用 `globalRegistry.register` 注册的原件。可以通过字符串名称使用, 例如：

   ```vue
   <FatFormItem value-type="switch" />
   ```

   <br>
   <br>
   <br>

2. 直接将 atomic 定义传入， 例如

   ```tsx
   const switch = defineAtomic({
     name: 'switch',
     component: ASwitchComponent,
     description: '开关',
     author: 'ivan-lee',
   })

   // 使用
   <FatFormItem valueType={switch} />
   ```

   <br>
   <br>
   <br>
