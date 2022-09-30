<template>
  <FatForm>
    <FatFormItem label="账号名" prop="name" initial-value="ivan"></FatFormItem>
    <FatFormItem label="昵称" prop="nickName" initial-value="狗蛋"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
