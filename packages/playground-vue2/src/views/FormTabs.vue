<template>
  <FatFormTabs>
    <FatFormTabPane label="步骤1" name="1">
      <FatFormItem prop="a" label="a" required></FatFormItem>
      <FatFormItem prop="b" label="b" required></FatFormItem>
      <FatFormItem prop="c" label="c" required></FatFormItem>
    </FatFormTabPane>
    <FatFormTabPane label="步骤2" name="2">
      <FatFormItem prop="d" label="d" required></FatFormItem>
      <FatFormItem prop="e" label="e" required></FatFormItem>
      <FatFormItem prop="f" label="f" required></FatFormItem>
    </FatFormTabPane>
    <FatFormTabPane label="步骤3" name="3">
      <FatFormItem prop="g" label="g" required></FatFormItem>
      <FatFormItem prop="h" label="h" required></FatFormItem>
      <FatFormItem prop="i" label="i" required></FatFormItem>
    </FatFormTabPane>
  </FatFormTabs>
</template>

<script lang="tsx" setup>
  import { FatFormTabs, FatFormTabPane, FatFormItem } from '@wakeadmin/components';
</script>
