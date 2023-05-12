# FAQ

<script setup>
	import AsyncOptions from './AsyncOptions'
	import AsyncOptionsWithSwrv from './AsyncOptionsWithSwrv'
</script>

<br>

## 1. select 原件怎么支持异步加载 options

::: tip
其他原件类似：tree-select, multi-select, cascader, cascader-lazy
:::

<br>

**方式 1： 直接传入一个异步函数**

<ClientOnly>
  <div class="wk-demo"><AsyncOptions /></div>
</ClientOnly>

::: details 查看代码
<<< @/atomics/AsyncOptions.tsx
:::

要点：

- 异步函数只会在原件挂载(setup)时执行一次。后续原件重新渲染不会被执行
- 重复的异步函数会被自动合并。所以可以放心地在表格(FatTable)等场景使用它。

<br>
<br>

**方式 2： 手动维护**

可以自己手动请求数据，并通过 ref 保存起来。这种方式适用于需要手动控制请求时机、刷新时机的场景。

示例：配合 [swrv](https://docs-swrv.netlify.app/) 使用：

<ClientOnly>
  <div class="wk-demo"><AsyncOptionsWithSwrv /></div>
</ClientOnly>

::: details 查看代码
<<< @/atomics/AsyncOptionsWithSwrv.tsx
:::

<br>
<br>
<br>
<br>
