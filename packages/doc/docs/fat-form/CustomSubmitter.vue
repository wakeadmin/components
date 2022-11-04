<template>
  <FatForm :style="{ maxWidth: '500px', margin: '0 auto' }">
    <FatFormItem prop="id" label="身份证" width="large" required></FatFormItem>
    <FatFormItem prop="address" label="地址" width="large"></FatFormItem>
    <FatFormItem prop="note" label="备注" width="huge" value-type="textarea"></FatFormItem>
    <template #submitter="scope">
      <FatFormGroup label-width="auto">
        <el-button type="primary" @click="scope.submit">自定义提交</el-button>
        <el-button>自定义按钮</el-button>
      </FatFormGroup>
    </template>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup } from '@wakeadmin/components';
</script>
