<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-radio-group v-model="layout">
        <el-radio-button label="horizontal"></el-radio-button>
        <el-radio-button label="vertical"></el-radio-button>
        <el-radio-button label="inline"></el-radio-button>
      </el-radio-group>
    </div>
    <FatForm :layout="layout" :submit="handleSubmit">
      <FatFormItem label="用户名" prop="name" trim="blur"></FatFormItem>
      <FatFormItem label="密码" prop="password" value-type="password"></FatFormItem>
    </FatForm>
  </div>
</template>

<script setup lang="tsx">
  import { FatForm, FatFormItem } from '@wakeadmin/components';
  import { ref } from 'vue';

  const layout = ref<any>('horizontal');

  const handleSubmit = async (value: any) => {
    console.log(value);
  };
</script>
