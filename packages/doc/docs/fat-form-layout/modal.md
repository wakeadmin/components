<script setup>
  import Modal from './Modal.vue'
  import ModalWithTabs from './ModalWithTabs.vue'

</script>

# FatFormModal 表单模态框

`FatFormModal` 是 FatForm 针对 模态框场景设计的一个组件。适用于弹窗式的表单创建、编辑需求。

<br>
<br>

## 示例

<ClientOnly>
  <div class="wk-demo"><Modal /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form-layout/Modal.vue
:::

<br>
<br>
<br>

`FatFormSteps`、`FatFormTabs` 等 `FatForm` 的'子类' 也支持和 `FatFormModal` 配合使用

<ClientOnly>
  <div class="wk-demo"><ModalWithTabs /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-form-layout/ModalWithTabs.vue
:::

<br>
<br>
<br>
<br>

## API

![](./images/fat-form-modal.png)

<br>
<br>
<br>
