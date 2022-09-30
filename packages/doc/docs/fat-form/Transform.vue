<template>
  <FatForm :submit="submit" layout="inline">
    <FatFormItem
      label="时间区间"
      prop="dateRange"
      value-type="date-range"
      :value-props="{ valueFormat: 'x' }"
      :transform="v => ({ startDate: v?.[0], endDate: v?.[1] })"
    ></FatFormItem>
    <FatFormItem label="生日" prop="birthday" value-type="date" :value-props="{ valueFormat: 'x' }"></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';

  // 复杂转换推荐在 submit 中进行
  const submit = async (values: any) => {
    console.log(values);
  };
</script>
