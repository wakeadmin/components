<template>
  <FatForm :enable-submitter="false" :style="{ maxWidth: '500px', margin: '0 auto' }">
    <FatFormItem prop="id" label="身份证" width="large"></FatFormItem>
    <FatFormItem prop="address" label="地址" width="large"></FatFormItem>
    <FatFormItem prop="note" label="备注" width="huge" value-type="textarea"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
