<template>
  <FatForm :enable-submitter="false">
    <FatFormGroup label="分组" vertical gutter="small">
      <FatFormItem prop="group[0]"></FatFormItem>
      <FatFormItem prop="group[1]"></FatFormItem>
      <FatFormItem prop="group[2]"></FatFormItem>
    </FatFormGroup>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
</script>
