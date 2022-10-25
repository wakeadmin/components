<template>
  <FatFormSteps formWidth="500px">
    <FatFormStep title="工作信息">
      <FatFormItem prop="name" label="姓名" required></FatFormItem>
      <FatFormItem
        prop="type"
        label="工作类型"
        valueType="select"
        :valueProps="{
          options: [
            { value: 0, label: '国企' },
            { value: 1, label: '私企' },
          ],
        }"
				required
      ></FatFormItem>
    </FatFormStep>

    <FatFormStep title="同步表单信息">
      <FatFormItem prop="dateRange" label="时间区间" valueType="date-range"></FatFormItem>
			<FatFormItem prop="note" label="备注" valueType="textarea"></FatFormItem>
    </FatFormStep>
  </FatFormSteps>
</template>

<script lang="tsx" setup>
  import { FatFormSteps, FatFormStep, FatFormItem } from '@wakeadmin/components';
</script>
