<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># 内置原件 <el-switch v-model="previewMode" /></div>
    <FatForm :mode="previewMode ? 'preview' : 'editable'" class="form">
      <FatFormItem prop="text" label="text" value-type="text" width="small" />
      <FatFormItem prop="textarea" label="textarea" value-type="textarea" width="huge" />
      <FatFormItem prop="date" label="date" value-type="date" width="medium" />
      <FatFormItem prop="time" label="time" value-type="time" width="medium" />
      <FatFormItem prop="dateTime" label="date-time" value-type="date-time" width="medium" />
      <FatFormItem prop="dateRange" label="date-range" value-type="date-range" width="large" />
      <FatFormItem prop="dateTimeRange" label="date-time-range" value-type="date-time-range" width="large" />
      <FatFormItem prop="timeRange" label="time-range" value-type="time-range" width="large" />
      <FatFormItem prop="password" label="password" value-type="password" width="small" />
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
      <FatFormItem
        prop="multi-select"
        label="multi-select"
        value-type="multi-select"
        width="small"
        :value-props="{
          options: [
            { label: '选项1', value: '1' },
            { label: '选项2', value: '2' },
          ],
          separator: ' - ',
        }"
      />
      <FatFormGroup label="checkbox1" gutter="small">
        <FatFormItem prop="checkbox1" value-type="checkbox" />
        <span>同意 996 吗</span>
      </FatFormGroup>
      <FatFormItem prop="checkbox2" label-width="auto" value-type="checkbox" :value-props="{ label: '是否开启' }" />
      <FatFormItem
        prop="radio"
        label="radio"
        value-type="radio"
        :value-props="{
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        }"
      />
      <FatFormItem
        prop="checkboxs"
        label="checkboxs"
        value-type="checkboxs"
        :value-props="{
          options: [
            { label: '选我', value: 1 },
            { label: '选我啊', value: 0 },
          ],
        }"
      />
      <FatFormItem prop="integer" label="integer" value-type="integer"></FatFormItem>
      <FatFormItem prop="rate" label="rate" value-type="rate"></FatFormItem>
      <FatFormItem prop="slider" label="slider" value-type="slider" width="large"></FatFormItem>
      <FatFormItem
        prop="sliderVertical"
        label="slider-vertical"
        value-type="slider"
        :value-props="{ vertical: true }"
      ></FatFormItem>
      <FatFormItem prop="progress" label="progress" value-type="progress" :initial-value="50"></FatFormItem>
      <FatFormItem
        prop="images"
        label="images"
        value-type="images"
        :value-props="{ sizeLimit: 1024 * 100 }"
        message="请上传文件，大小不超过 100kb"
      ></FatFormItem>
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup, FatFormConsumer } from '@wakeadmin/components';
  import { ref } from 'vue';

  const previewMode = ref(false);
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 50px;
  }
</style>
