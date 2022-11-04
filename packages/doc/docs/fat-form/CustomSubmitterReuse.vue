<template>
  <FatForm :style="{ maxWidth: '500px', margin: '0 auto' }">
    <FatFormItem prop="id" label="身份证" width="large" required></FatFormItem>
    <FatFormItem prop="address" label="地址" width="large"></FatFormItem>
    <FatFormItem prop="note" label="备注" width="huge" value-type="textarea"></FatFormItem>
    <template #submitter="scope">
      <FatFormGroup label-width="auto">
        <!-- vue template 不是直接渲染 VNode，可以使用 FatVNode 组件间接渲染  -->
        <FatVNode :vnode="scope.renderButtons()" />
        <el-button>自定义按钮</el-button>
      </FatFormGroup>
    </template>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormGroup, FatVNode } from '@wakeadmin/components';
</script>
