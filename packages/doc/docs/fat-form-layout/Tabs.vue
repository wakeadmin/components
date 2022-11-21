<template>
  <FatFormTabs :submit="handleSubmit">
    <FatFormTabPane label="工作信息" name="work">
      <FatFormItem prop="name" label="姓名" required></FatFormItem>
      <FatFormItem
        prop="type"
        label="工作类型"
        value-type="select"
        :value-props="{
          options: [
            { value: 0, label: '国企' },
            { value: 1, label: '私企' },
          ],
        }"
        required
      ></FatFormItem>
    </FatFormTabPane>

    <FatFormTabPane label="同步表单信息" name="sync">
      <FatFormItem prop="dateRange" label="时间区间" value-type="date-range"></FatFormItem>
      <FatFormItem prop="note" label="备注" value-type="textarea"></FatFormItem>
    </FatFormTabPane>
  </FatFormTabs>
</template>

<script lang="tsx" setup>
  import { FatFormTabs, FatFormTabPane, FatFormItem } from '@wakeadmin/components';

  const handleSubmit = async (values: any) => {
    console.log(values);
  };
</script>
