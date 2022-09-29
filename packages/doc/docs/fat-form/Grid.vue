<template>
  <FatForm>
    <FatFormItem label="标题" prop="name" tooltip="最长 24 位"></FatFormItem>
    <FatFormGroup>
      <FatFormItem :col="{ md: 12, xl: 8 }" prop="company" label="姓名"></FatFormItem>
      <FatFormItem :col="{ md: 12, xl: 8 }" prop="phone" label="电话"></FatFormItem>
      <FatFormItem :col="{ md: 12, xl: 8 }" prop="email" label="邮箱"></FatFormItem>
    </FatFormGroup>
    <FatFormItem :col="24" prop="textarea" value-type="textarea" label="文本框"></FatFormItem>
    <FatFormGroup>
      <FatFormItem :col="12" prop="date" value-type="date" label="入职时间"></FatFormItem>
      <FatFormItem :col="12" prop="dateRange" value-type="date-range" label="工作周期"></FatFormItem>
    </FatFormGroup>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
</script>
