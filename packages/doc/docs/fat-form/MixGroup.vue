<template>
  <FatForm :enable-submitter="false">
    <FatFormGroup>
      获取积分后， 第
      <FatFormItem prop="name" value-type="integer" width="mini"></FatFormItem>
      个 3 月 31 日 23:59:59 失效
    </FatFormGroup>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
</script>
