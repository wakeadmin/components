<template>
  <FatForm :enable-submitter="false">
    <FatFormItem prop="a" label="默认" message="默认提示信息，位于表单下方"></FatFormItem>
    <FatFormItem prop="b" label="内联" inline-message message="内联提示信息"></FatFormItem>
    <FatFormItem prop="c" label="悬浮信息" tooltip="这是悬浮提示信息"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
