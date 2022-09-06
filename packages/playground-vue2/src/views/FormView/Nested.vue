<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># 嵌套表单</div>
    <FatForm class="form">
      <FatFormItem prop="text" label="text" value-type="text" width="small" :rules="{ required: true }" />

      <FatForm>
        <FatFormItem prop="text" label="text" value-type="text" width="small" :rules="{ required: true }" />
      </FatForm>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 50px;
  }
</style>
