<script setup>
  import Drawer from './Drawer.vue'
  import DrawerWithSteps from './DrawerWithSteps.vue'

</script>

# FatFormDrawer 表单抽屉

**`FatFormDrawer` 和 [FatFormModal](./modal.md) 的 API 基本一致。**

`FatFormDrawer` 是 FatForm 针对 抽屉场景设计的一个组件。适用于弹窗式的表单创建、编辑需求。

<br>
<br>

## 示例

<ClientOnly>
  <div class="wk-demo"><Drawer /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form-layout/Drawer.vue
:::

<br>
<br>
<br>
<br>

`FatFormSteps`、`FatFormTabs` 等 `FatForm` 的'子类' 也支持和 `FatFormDrawer` 配合使用

<ClientOnly>
  <div class="wk-demo"><DrawerWithSteps /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form-layout/DrawerWithSteps.vue
:::

<br>
<br>
<br>
<br>

## API

![](./images/fat-form-drawer.png)

<br>
<br>
<br>
