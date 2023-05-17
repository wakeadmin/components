# FatTableSelectModal

## 示例

<script setup>
  import Modal from './TableSelectModal.vue'
  import ModalMulti from './TableSelectMultiModal.vue'
  import ModalCustomColumn from './TableSelectModalCustomColumn.vue'

</script>

### 单选

<ClientOnly>
  <div class="wk-demo"><Modal /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-table-layout/TableSelectModal.vue
:::

<br>
<br>
<br>

### 多选

<ClientOnly>
  <div class="wk-demo"><ModalMulti /></div>
</ClientOnly>

::: details 查看代码
<<< @/fat-table-layout/TableSelectMultiModal.vue
:::

<br>
<br>
<br>
<br>

### 自定义选择栏

<ClientOnly>
  <div class="wk-demo"><ModalCustomColumn /></div>
</ClientOnly>
