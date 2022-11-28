<template>
  <div class="container">
    <div @click="count++">{{ count }}</div>
    <FatFormSteps :form-width="550" :submit="handleSubmit" :strict="false">
      <FatFormStep title="步骤1">
        <div>{{ count }}</div>
        <FatFormItem prop="a" label="a" required></FatFormItem>
        <FatFormItem prop="b" label="b" required></FatFormItem>
        <FatFormItem prop="c" label="c" required></FatFormItem>
      </FatFormStep>
      <FatFormStep title="步骤2">
        <FatFormItem prop="d" label="d" required></FatFormItem>
        <FatFormItem prop="e" label="e" required></FatFormItem>
        <FatFormItem prop="f" label="f" required></FatFormItem>
      </FatFormStep>
      <FatFormStep title="步骤3">
        <FatFormItem prop="g" label="g" required></FatFormItem>
        <FatFormItem prop="h" label="h" required></FatFormItem>
        <FatFormItem prop="i" label="i" required></FatFormItem>
      </FatFormStep>
      <template #submitter="scope"> ok <VNode :vnodes="scope.renderButtons()"></VNode> </template>
    </FatFormSteps>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { FatFormSteps, FatFormStep, FatFormItem } from '@wakeadmin/components';

  const VNode: any = {
    functional: true,
    // @ts-ignore
    render: (h, ctx) => ctx.props.vnodes,
  };

  const count = ref(0);

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
