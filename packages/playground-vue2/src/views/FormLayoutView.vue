<template>
  <div class="container">
    <FatFormPage :enable-reset="false" @cancel="handleCancel">
      <template #title>你好世界</template>
      <FatFormSection title="分组1">
        <FatFormItem
          prop="name"
          label="名称"
          message="必须合法"
          width="medium"
          :rules="{ required: true }"
        ></FatFormItem>
        <FatFormItem prop="age" label="年龄" width="huge"></FatFormItem>
        <FatFormGroup>
          <FatFormItem prop="id" label="身份证" message="必须合法" width="medium"></FatFormItem>
          <FatFormItem prop="address" label="地址" width="huge"></FatFormItem>
        </FatFormGroup>
      </FatFormSection>
    </FatFormPage>
  </div>
</template>

<script lang="tsx" setup>
  import { FatFormPage, FatFormSection, FatFormItem, FatFormGroup } from '@wakeadmin/components';

  const handleCancel = () => {
    console.log('cancel');
  };
</script>

<style lang="scss" scoped>
  .container {
    background-color: #f5f7fa;
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;
    padding: 20px;
  }
</style>
