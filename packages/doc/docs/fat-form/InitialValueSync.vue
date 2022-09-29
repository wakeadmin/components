<template>
  <FatForm :initial-value="initialValue" sync-to-initial-values>
    <FatFormItem label="账号名" prop="name"></FatFormItem>
    <FatFormItem label="昵称" prop="nickName"></FatFormItem>
    <FatFormGroup label="数据">
      <pre><code>{{JSON.stringify(initialValue, null, 2)}}</code></pre>
    </FatFormGroup>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
  import { reactive } from 'vue';

  const initialValue = reactive({
    name: 'ivan',
    nickName: '狗蛋',
  });
</script>
