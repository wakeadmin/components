<template>
  <FatForm :request="request">
    <FatFormItem label="账号名" prop="name"></FatFormItem>
    <FatFormItem label="昵称" prop="nickName"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';

  const request = async () => {
    return {
      name: 'ivan',
      nickName: '狗蛋',
    };
  };
</script>
