<template>
  <FatForm :initial-value="initialValue">
    <FatFormItem label="账号名" prop="name"></FatFormItem>
    <FatFormItem label="昵称" prop="nickName"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';

  const initialValue = {
    name: 'ivan',
    nickName: '狗蛋',
  };
</script>
