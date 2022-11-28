<template>
  <FatFormTabs>
    <FatFormTabPane name="1">
      <template #label
        ><div @click="count2++">xxx{{ count2 }}</div></template
      >
      <div @click="count++">
        {{ count }}
      </div>

      <FatFormItem prop="a" label="a" required></FatFormItem>
      <FatFormItem prop="b" label="b" required></FatFormItem>
      <FatFormItem prop="c" label="c" required></FatFormItem>
    </FatFormTabPane>
    <FatFormTabPane label="步骤2" name="2">
      <div>
        {{ count }}
      </div>
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
  import { ref } from 'vue';
  import { FatFormTabs, FatFormTabPane, FatFormItem } from '@wakeadmin/components';

  const count = ref(0);
  const count2 = ref(0);
</script>
