<template>
  <FatForm :enable-submitter="false">
    <FatFormSection title="基本信息">
      <FatFormItem prop="name" label="名称" width="medium" :rules="{ required: true }"></FatFormItem>
      <FatFormItem prop="age" label="年龄" width="huge"></FatFormItem>
    </FatFormSection>

    <FatFormSection title="详细信息">
      <FatFormItem prop="id" label="身份证" width="large"></FatFormItem>
      <FatFormItem prop="address" label="地址" width="large"></FatFormItem>
      <FatFormItem prop="note" label="备注" width="huge" value-type="textarea"></FatFormItem>
    </FatFormSection>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormSection } from '@wakeadmin/components';
</script>
