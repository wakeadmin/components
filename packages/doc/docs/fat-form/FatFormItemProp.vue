<template>
  <FatForm>
    <FatFormItem label="审批人" prop="user" placeholder="审批人" width="small"></FatFormItem>
    <FatFormItem
      label="活动区域"
      prop="region"
      placeholder="活动区域"
      width="small"
      value-type="select"
      :value-props="{
        options: [
          { label: '区域一', value: 'shanghai' },
          { label: '区域二', value: 'beijing' },
        ],
      }"
    ></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
