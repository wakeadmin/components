<template>
  <FatFormSteps>
    <FatFormStep title="步骤1">
      <FatFormItem prop="a" label="a" required></FatFormItem>
      <FatFormItem prop="b" label="b" required></FatFormItem>
      <FatFormItem prop="c" label="c" required></FatFormItem>
    </FatFormStep>
    <FatFormStep title="步骤2">
      <FatFormItem prop="d" label="d" required></FatFormItem>
      <FatFormItem prop="e" label="e" required></FatFormItem>
      <FatFormItem prop="f" label="f" required></FatFormItem>
    </FatFormStep>
  </FatFormSteps>
</template>

<script lang="tsx" setup>
  import { FatFormSteps, FatFormStep, FatFormItem } from '@wakeadmin/components';
</script>
