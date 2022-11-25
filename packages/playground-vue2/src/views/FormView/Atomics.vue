<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># 内置原件 <el-switch v-model="previewMode" /></div>
    <FatText copyable>hello</FatText>
    <FatForm ref="formRef" :mode="previewMode ? 'preview' : 'editable'" class="form">
      <FatFormTable
        label="table"
        prop="table"
        sortable
        required
        :width="800"
        :max="3"
        :columns="[
          { prop: 'foo', initialValue: '1', label: '姓名', width: 'small', required: true },
          { prop: 'bar.bar', initialValue: '2', label: '地址' },
          { prop: 'baz', initialValue: false, valueType: 'switch', label: '开启', width: 'mini' },
        ]"
      ></FatFormTable>
      <FatFormItem prop="text" label="text" value-type="text" width="small" trim required />
      <FatFormItem prop="password" label="password" value-type="password" width="small" />
      <FatFormItem prop="search" label="search" value-type="search" width="medium" />
      <FatFormItem prop="textarea" label="textarea" value-type="textarea" width="huge" />
      <FatFormItem prop="url" label="url" value-type="url" width="huge" />
      <FatFormItem prop="email" label="email" value-type="email" width="huge" />
      <FatFormItem prop="phone" label="phone" value-type="phone" width="small" :value-props="{ mask: true }" />
      <FatFormItem
        prop="captcha"
        label="captcha"
        value-type="captcha"
        width="medium"
        :value-props="{ onGetCaptcha: handleGetCaptcha }"
      />
      <FatFormItem prop="date" label="date" value-type="date" width="medium" />
      <FatFormItem prop="time" label="time" value-type="time" width="medium" />
      <FatFormItem prop="dateTime" label="date-time" value-type="date-time" width="medium" />
      <FatFormItem prop="dateRange" label="date-range" value-type="date-range" width="large" />
      <FatFormItem prop="dateTimeRange" label="date-time-range" value-type="date-time-range" width="large" />
      <FatFormItem prop="timeRange" label="time-range" value-type="time-range" width="large" />
      <FatFormItem prop="switch" label="switch" value-type="switch" width="mini" />
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
        label="selectLazy"
        value-type="select"
        width="small"
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
      <FatFormGroup label="checkbox1">
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
        prop="radio"
        label="radio"
        value-type="radio"
        :value-props="{
          vertical: true,
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 },
          ],
        }"
      />
      <FatFormItem
        prop="radio"
        label="radio"
        value-type="radio"
        :value-props="{
          options: [
            { label: a => `是${a ? '谢谢' : ''}`, value: 1 },
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
      <FatFormItem
        prop="radioVertical"
        label="radioVertical"
        value-type="radio"
        :value-props="{
          vertical: true,
          options: optionsWithJSX,
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
      <FatFormItem
        prop="checkboxsVertical"
        label="checkboxsVertical"
        value-type="checkboxs"
        :value-props="{
          vertical: true,
          options: optionsWithJSX,
        }"
      />
      <FatFormItem
        prop="checkboxs"
        label="checkboxs"
        value-type="checkboxs"
        :value-props="{
          options: [
            { label: a => `选我${a ? '谢谢' : ''}`, value: 1 },
            { label: '选我啊', value: 0 },
          ],
        }"
      />
      <FatFormItem prop="integer" label="integer" value-type="integer"></FatFormItem>
      <FatFormItem prop="float" label="float" value-type="float"></FatFormItem>
      <FatFormItem
        prop="currency"
        label="currency"
        value-type="currency"
        :value-props="{ format: '%s  %v  %s' }"
      ></FatFormItem>
      <FatFormItem prop="rate" label="rate" value-type="rate"></FatFormItem>
      <FatFormItem prop="slider" label="slider" value-type="slider" width="large"></FatFormItem>
      <FatFormItem prop="sliderRange" label="slider-range" value-type="slider-range" width="large"></FatFormItem>
      <FatFormItem
        prop="sliderVertical"
        label="slider-vertical"
        value-type="slider"
        :value-props="{ vertical: true }"
      ></FatFormItem>
      <FatFormItem prop="progress" label="progress" value-type="progress" :initial-value="50"></FatFormItem>
      <FatFormItem
        prop="files"
        label="files"
        value-type="files"
        :value-props="{ sizeLimit: 1024 * 100, accept: ['.png', '.jpg'] }"
        message="请上传png/jpg文件，大小不超过 100 KB"
      ></FatFormItem>
      <FatFormItem
        prop="filesDrag"
        label="filesDrag"
        value-type="files"
        :value-props="{ sizeLimit: 1024 * 100, accept: ['.png', '.jpg'], drag: true }"
        message="请上传png/jpg文件，大小不超过 100 KB"
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
      <FatFormItem
        prop="cascaderLazy"
        label="cascaderLazy"
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
      <FatFormItem
        prop="tree-select"
        :initial-value="[111]"
        value-type="tree-select"
        label="tree-select"
        :value-props="treeSelectProps"
      />
      <FatFormConsumer v-slot="scope">
        {{ JSON.stringify(scope.values) }}
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import {
    useFatFormRef,
    FatForm,
    FatFormItem,
    FatFormTable,
    FatFormGroup,
    FatText,
    FatFormConsumer,
  } from '@wakeadmin/components';
  import { Message, Switch as ElSwitch } from 'element-ui';
  import { delay } from '@wakeapp/utils';
  import { ref } from 'vue';

  const formRef = useFatFormRef();

  const cascaderLazyProps = {
    async load(node?: string) {
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
    Message.success('验证码获取成功');
  };

  const optionsWithJSX = [
    {
      label: (
        <FatFormGroup>
          选我, <FatFormItem valueType="text" required prop="embedText"></FatFormItem>
        </FatFormGroup>
      ),
      value: 1,
    },
    {
      label: (
        <FatFormGroup>
          选我 啊, <FatFormItem valueType="text" required prop="embedText"></FatFormItem>
        </FatFormGroup>
      ),
      value: 2,
    },
  ];

  const treeSelectProps = {
    multiple: true,
    async data() {
      return [
        {
          label: '一级 1',
          value: 1,
          children: [
            {
              label: '二级 1-1',
              value: 11,
              children: [
                {
                  label: '三级 1-1-1',
                  value: 111,
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          value: 2,
          disabled: true,
          children: [
            {
              label: '二级 2-1',
              value: 21,
              children: [
                {
                  label: '三级 2-1-1',
                  value: 211,
                },
              ],
            },
            {
              label: '二级 2-2',
              value: 22,
              children: [
                {
                  label: '三级 2-2-1',
                  value: 221,
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          value: 3,
          children: [
            {
              label: '二级 3-1',
              value: 31,
              children: [
                {
                  label: '三级 3-1-1',
                  value: 311,
                  children: [
                    {
                      label: '四级 3-1-1-1',
                      value: 3111,
                      children: [
                        {
                          label: '五级 -------- 3-1-1-1-1',
                          value: 31111,
                        },
                        {
                          label: '五级 --------- 3-1-1-1-2',
                          value: 31112,
                        },
                      ],
                    },
                    {
                      label: '四级 3-1-1-2',
                      value: 3112,
                    },
                  ],
                },
              ],
            },
            {
              label: '二级 3-2',
              value: 32,
              children: [
                {
                  label: '三级 3-2-1',
                  value: 321,
                },
              ],
            },
          ],
        },
      ];
    },
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
    margin-top: 50px;
  }
</style>
