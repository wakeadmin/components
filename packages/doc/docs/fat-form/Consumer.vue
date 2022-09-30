<template>
  <FatForm :enable-submitter="false">
    <FatFormItem label="签约客户名称" prop="user" width="medium"></FatFormItem>
    <FatFormConsumer v-slot="scope">
      <FatFormItem
        prop="agree"
        label-width="auto"
        value-type="checkbox"
        :disabled="!scope.values.user"
        :value-props="{ label: `同意与 《${scope.values.user || '客户名称'}》签订合同` }"
      ></FatFormItem>
    </FatFormConsumer>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
</script>
