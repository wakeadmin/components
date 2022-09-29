<template>
  <FatForm :col="{ xl: 6, lg: 8, sm: 12 }" label-width="100px">
    <FatFormItem prop="a" label="名称"></FatFormItem>
    <FatFormItem prop="b" label="姓名"></FatFormItem>
    <FatFormItem prop="c" label="收货地址"></FatFormItem>
    <FatFormItem prop="d" label="手机号码"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
