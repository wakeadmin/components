<script setup>
  import DefineHelloWorld from './DefineHelloWorld'
  import {UseConsumer, NotUseConsumer} from './DefineCompare'
  import DefineDemo from './DefineDemo.tsx'
</script>

# defineFatForm 定义器

和 [`defineFatTable`](../fat-form/index.md) 类似， 我们也提供了 defineFatForm 用于快速定义表单。相比直接使用 `<template>`， defineFatForm 可以提供更好的类型提示和检查。

<br>
<br>
<br>

## Hello world

<ClientOnly>
  <div class="wk-demo"><DefineHelloWorld /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form/DefineHelloWorld.tsx
:::

<br>

`defineFatForm` 使用方法类似于 Vue 的 `defineComponent`, 只不过返回一个 `DSL`, 这个 DSL 定义了表单的结构和配置信息。

<br>
<br>
<br>
<br>

## 定义结构

defineFatForm 的 `DSL` 需要满足类似 `<template>` 的灵活结构的同时，保持一定约束性。为此我们提供了一些 `helpers` 来辅助你定义这个 DSL，并且能关联类型上下文。

- `group` 定义 [`FatFormGroup`](./group.md)
- `item` 定义 [`FatFormItem`](./item.md)
- `section` 定义 [`FatFormSection`](./section.md)
- `consumer` 定义 [`FatFormConsumer`](./consumer.md)
- `table` 定义 [`FatFormTable`](../fat-form-layout/table.md)
- `tableColumn` 定义 [`FatFormTable#columns` 子项](../fat-form-layout/table.md)

<br>
<br>

::: tip 底层方法

- renderChild 可以将上述辅助转换为 JSX 节点
- renderChildren 和 renderChild 类似，只不过支持接收一个数组

:::

<br>

上述 `helper` 接收对应组件的 Props，除了 `item` , `group`、`section` 还支持传入一个 `children` 字段, 用于定义下级节点:

<br>
<br>

```tsx
defineFatForm(({ item, group, section, consumer }) => {
  return () => ({
    // 这里放置 FatForm 的 Props
    // ...

    // 定义下级节点
    children: [
      group({
        children: [
          // group 支持下级节点
        ],
      }),
      section({
        children: [
          // section 支持下级节点
          group({
            // 可以逐级嵌套
            children: [],
          }),
        ],
      }),
      consumer(() => {
        // consumer 回调的返回值等价于 children
        return [];
      }),
    ],
  });
});
```

<br>
<br>
<br>

`children` 支持传入 `item`、`group`、`section`、`consumer`, 以及 JSX:

<br>

```tsx
defineFatForm(({ item, group, section, consumer }) => {
  return () => ({
    // 定义下级节点
    children: [
      group({
        /*..*/
      }),
      item({
        /*..*/
      }),
      section({
        /*..*/
      }),
      consumer(() => {
        /*..*/
      }),
      <div>JSX</div>,
      someCondition && <div>JSX</div>,
    ],
  });
});
```

<br>
<br>
<br>

## 为什么推荐使用 `consumer` 而不是直接写 `JSX`

如果想要实现表单联动等, 依赖于表单数据的渲染，我们推荐使用 consumer, 因为它能够实现精确渲染。下面对比两个示例(打开 Vue 开发者工具的 Highlight Updates 查看重新渲染的范围):

<ClientOnly>
  <div class="wk-demo">
    <div>
      <h3>使用 consumer</h3>
      <UseConsumer></UseConsumer>
    </div>
    <div>
      <h3>未使用 consumer</h3>
      <NotUseConsumer></NotUseConsumer>
    </div>
  </div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form/DefineCompare.tsx
:::

<br>
<br>
<br>
<br>

## 示例

来看一个相对复杂的案例，这个案例来源于惟客云(会员中心/积分倍率活动)。这个例子会展示 checkboxs 原件，FatFormGroup 的妙用：

<ClientOnly>
  <div class="wk-demo"><DefineDemo /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form/DefineDemo.tsx
:::

<br>
<br>
<br>

要点：

- `FatFormGroup` 配置的状态可以被下级继承。这些状态包含 mode, size, disabled, hidden, hideMessageOnPreview, clearable, col 等。如果下级显式配置了这些属性，那么将以下级的优先。
- `renderChild` 用于将 item, group, consumer, section 等 helper 的输出转换为 JSX。这是一个底层方法，用于一些复杂的场景。
- 当 `FatFormItem` 的状态为 hidden，disabled 或者 mode 为 'preview' 时，针对该字段的验证规则也会自动移除。
- `rules` 支持传入一个函数，用于依赖上下文的一些验证。 另外一个配合 dependencies 配置依赖的其他字段，当这些字段变化时重新验证。
- 最佳实践是在 FatFormItem 上配置 rule，而不是在 FatForm 上。这样更加灵活，尤其是在动态表单的场景。
