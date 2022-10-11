<template>
  <div>
    <div>预览模式: <el-switch v-model="previewMode" /></div>

    <FatForm ref="formRef" :mode="previewMode ? 'preview' : 'editable'" class="form" :enable-submitter="false">
      <FatFormSection title="文本类">
        <FatFormItem prop="text" label="text" value-type="text" width="small" trim required />
        <FatFormItem prop="password" label="password" value-type="password" width="small" />
        <FatFormItem prop="search" label="search" value-type="search" width="medium" />
        <FatFormItem prop="textarea" label="textarea" value-type="textarea" width="huge" />
        <FatFormItem prop="url" label="url" value-type="url" width="huge" />
        <FatFormItem prop="email" label="email" value-type="email" width="huge" />
        <FatFormItem prop="phone" label="phone" value-type="phone" width="small" :value-props="{ mask: true }" />
      </FatFormSection>

      <FatFormSection title="日期类">
        <FatFormItem prop="date" label="date" value-type="date" width="medium" />
        <FatFormItem prop="time" label="time" value-type="time" width="medium" />
        <FatFormItem prop="dateTime" label="date-time" value-type="date-time" width="medium" />
        <FatFormItem prop="dateRange" label="date-range" value-type="date-range" width="large" />
        <FatFormItem prop="dateTimeRange" label="date-time-range" value-type="date-time-range" width="large" />
        <FatFormItem prop="timeRange" label="time-range" value-type="time-range" width="large" />
      </FatFormSection>

      <FatFormSection title="选择类">
        <FatFormItem
          prop="select"
          label="select"
          value-type="select"
          width="small"
          :value-props="{
            options: [
              { label: '选项1', value: '1', color: 'primary' },
              { label: '选项2', value: '2', color: 'success' },
            ],
          }"
        />
        <FatFormItem
          prop="selectLazy"
          label="select"
          value-type="select"
          width="small"
          message="异步获取 options"
          :value-props="{
            options: async () => [
              { label: '选项1', value: '1', color: 'primary' },
              { label: '选项2', value: '2', color: 'success' },
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
          prop="radioInButton"
          label="radioInButton"
          value-type="radio"
          :value-props="{
            inButton: true,
            options: [
              { label: '上海', value: 0 },
              { label: '北京', value: 1 },
              { label: '广州', value: 2 },
              { label: '深圳', value: 3 },
            ],
          }"
        />
        <FatFormGroup label="checkbox" gutter="small" message="配合 fat-form-group 使用">
          <FatFormItem prop="checkbox" value-type="checkbox" />
          <span>同意 996 吗</span>
        </FatFormGroup>
        <FatFormItem prop="checkbox" label-width="auto" value-type="checkbox" :value-props="{ label: '是否开启' }" />
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
        <FatFormItem
          prop="cascaderLazy"
          label="cascader-lazy"
          value-type="cascader-lazy"
          width="huge"
          :value-props="cascaderLazyProps"
          :initial-value="['0', '01', '012', '0121']"
        />
        <FatFormItem
          prop="cascader"
          label="cascader"
          value-type="cascader"
          width="huge"
          :value-props="cascaderProps"
          :initial-value="[0, 2]"
        />
      </FatFormSection>

      <FatFormSection title="数字类">
        <FatFormItem prop="integer" label="integer" value-type="integer"></FatFormItem>
        <FatFormItem prop="float" label="float" value-type="float"></FatFormItem>
        <FatFormItem prop="currency" label="currency" value-type="currency"></FatFormItem>
      </FatFormSection>

      <FatFormSection title="交互类">
        <FatFormItem prop="switch" label="switch" value-type="switch" width="mini" />
        <FatFormItem
          prop="captcha"
          label="captcha"
          value-type="captcha"
          width="medium"
          :value-props="{ onGetCaptcha: handleGetCaptcha }"
        />
        <FatFormItem prop="rate" label="rate" value-type="rate"></FatFormItem>
        <FatFormItem prop="slider" label="slider" value-type="slider" width="large"></FatFormItem>
        <FatFormItem prop="sliderRange" label="slider-range" value-type="slider-range" width="large"></FatFormItem>
        <FatFormItem
          prop="sliderVertical"
          label="slider"
          value-type="slider"
          :value-props="{ vertical: true }"
          message="垂直模式"
          :initial-value="50"
        ></FatFormItem>
      </FatFormSection>

      <FatFormItem prop="progress" label="progress" value-type="progress" :initial-value="50"></FatFormItem>

      <FatFormSection title="文件类">
        <FatFormItem
          prop="files"
          label="files"
          value-type="files"
          :value-props="{ sizeLimit: 1024 * 100, accept: ['.png', '.jpg'] }"
          message="请上传png/jpg文件，大小不超过 100 KB"
        ></FatFormItem>
        <FatFormItem
          prop="filesDrag"
          label="files"
          value-type="files"
          :value-props="{ sizeLimit: 1024 * 100, accept: ['.png', '.jpg'], drag: true }"
          message="拖拽模式: 请上传png/jpg文件，大小不超过 100 KB"
        ></FatFormItem>
        <FatFormItem prop="file" label="file" value-type="file"></FatFormItem>
        <FatFormItem
          prop="images"
          label="images"
          value-type="images"
          :value-props="{ sizeLimit: 1024 * 100, accept: ['.png', '.jpg'] }"
          :rules="{ required: true }"
          message="请上传文件，大小不超过 100 KB"
        ></FatFormItem>
        <FatFormItem
          prop="imagesLimited"
          label="images-limited"
          value-type="images"
          :value-props="{ limit: 3 }"
          message="限制 3 张"
        ></FatFormItem>
        <FatFormItem prop="image" label="image" value-type="image" message="单图片"></FatFormItem>
      </FatFormSection>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { useFatFormRef, FatForm, FatFormItem, FatFormGroup, FatFormSection } from '@wakeadmin/components';
  import { ElMessage } from 'element-plus';
  import { delay } from '@wakeapp/utils';
  import { ref } from 'vue';

  const formRef = useFatFormRef();

  const cascaderLazyProps = {
    async load(node: string) {
      // root
      if (node == null) {
        return new Array(10).fill(0).map((i, idx) => ({
          label: `root-${idx}`,
          value: String(idx),
        }));
      }

      const level = node.length;

      if (level > 3) {
        return [];
      }

      return new Array(10).fill(10).map((i, idx) => ({
        label: `${node}${idx}`,
        value: `${node}${idx}`,
        children: level === 3 ? null : undefined,
      }));
    },
  };

  const handleGetCaptcha = async () => {
    await delay(1000);
    ElMessage.success('验证码获取成功');
  };

  const cascaderProps = {
    async options() {
      return [
        {
          label: '广东',
          value: 0,
          children: [
            { label: '珠海', value: 2 },
            { label: '深圳', value: 3 },
          ],
        },
        {
          label: '广西',
          value: 1,
          children: [
            { label: '南宁', value: 4 },
            { label: '桂林', value: 5 },
          ],
        },
      ];
    },
  };

  const previewMode = ref(false);
</script>

<style lang="scss" scoped>
  .form {
    margin-top: 20px;
  }
</style>
