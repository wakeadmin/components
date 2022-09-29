<template>
  <FatForm>
    <FatFormItem prop="mini0" label="短文本(mini)" width="mini"> </FatFormItem>
    <FatFormItem
      prop="mini1"
      label="短数字(mini)"
      width="mini"
      value-type="integer"
      :value-props="{ placeholder: '数字' }"
    >
    </FatFormItem>
    <FatFormItem prop="small" label="较短文本(small)" width="small"></FatFormItem>
    <FatFormItem prop="medium" label="标准文本(medium)" width="medium" message="适合大部分字段长度"></FatFormItem>
    <FatFormItem
      prop="large"
      label="长字段(large)"
      width="large"
      value-type="url"
      message="适用于较长字段录入，如长网址、标签组、文件路径等"
    ></FatFormItem>
    <FatFormItem
      prop="huge"
      label="长文本输入(huge)"
      width="huge"
      value-type="textarea"
      message="552px 适用于长文本录入，如长链接、描述、备注等，通常搭配自适应多行输入框或定高文本域使用"
    ></FatFormItem>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem } from '@wakeadmin/components';
</script>
