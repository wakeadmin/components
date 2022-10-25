<template>
  <div class="container">
    <FatFormSteps :form-width="500" :submit="handleSubmit" direction="vertical">
      <FatFormStep title="步骤1">
        <FatFormSection title="基础信息">
          <FatFormItem prop="a" label="a" required></FatFormItem>
          <FatFormItem prop="b" label="b" required></FatFormItem>
          <FatFormItem prop="c" label="c" required></FatFormItem>
        </FatFormSection>
        <FatFormSection title="详细信息">
          <FatFormItem prop="a" label="a" required></FatFormItem>
          <FatFormItem prop="b" label="b" required></FatFormItem>
          <FatFormItem prop="c" label="c" required></FatFormItem>
        </FatFormSection>
      </FatFormStep>
      <FatFormStep title="步骤2">
        <FatFormSection title="基础信息">
          <FatFormItem prop="d" label="d" required></FatFormItem>
          <FatFormItem prop="e" label="e" required></FatFormItem>
          <FatFormItem prop="f" label="f" required></FatFormItem>
        </FatFormSection>
      </FatFormStep>
    </FatFormSteps>
  </div>
</template>

<script lang="tsx" setup>
  import { FatFormSteps, FatFormStep, FatFormItem, FatFormSection } from '@wakeadmin/components';

  const handleSubmit = async (values: any) => {
    console.log(values);
  };
</script>

<style scoped>
  .container {
    background-color: #f5f7fa;
    width: 100%;
    min-height: 90vh;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
