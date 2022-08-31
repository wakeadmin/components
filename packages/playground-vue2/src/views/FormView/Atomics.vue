<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># 内置原件 <el-switch v-model="previewMode" /></div>
    <FatForm :mode="previewMode ? 'preview' : 'editable'" class="form">
      <FatFormItem prop="text" label="text" value-type="text" width="small" :value-props="{ placeholder: '请输入' }" />
      <FatFormItem
        prop="dataRange"
        label="date-range"
        value-type="date-range"
        width="large"
        :value-props="{ startPlaceholder: '开始时间', endPlaceholder: '截至时间' }"
      />
      <FatFormItem prop="switch" label="switch" value-type="switch" width="mini" />
      <FatFormItem
        prop="select"
        label="select"
        value-type="select"
        width="small"
        :value-props="{
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
          ],
        }"
      />
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
  import { ref } from 'vue';

  const previewMode = ref(false);
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 50px;
  }
</style>
