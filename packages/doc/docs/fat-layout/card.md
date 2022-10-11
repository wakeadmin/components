<script setup>
  import CardGrid from './CardGrid.vue'
  import CardGridEscaped from './CardGridEscaped.vue'
  import CardExtra from './CardExtra.vue'
  import CardHeaderless from './CardHeaderless.vue'
</script>

# FatCard 卡片

用于容纳一些页面片段, 比如表单、图表， 页面详情等等。

<br>
<br>
<br>

## 示例

**简单示例:**

<ClientOnly>
  <div class="wk-demo"><CardGrid /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-layout/CardGrid.vue
:::

<br>
<br>
<br>

**标题外置:**

<ClientOnly>
  <div class="wk-demo"><CardGridEscaped /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-layout/CardGridEscaped.vue
:::

<br>
<br>
<br>

**额外内容:**

<ClientOnly>
  <div class="wk-demo"><CardExtra /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-layout/CardExtra.vue
:::

<br>
<br>
<br>

**无标题模式:**

<ClientOnly>
  <div class="wk-demo"><CardHeaderless /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-layout/CardHeaderless.vue
:::

<br>
<br>
<br>
<br>

## API

![](./images/fat-card.png)

<br>
<br>
<br>
