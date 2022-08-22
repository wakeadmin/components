<template>
  <div>
    <el-radio-group v-model="layout">
      <el-radio-button label="inline"></el-radio-button>
      <el-radio-button label="horizontal"></el-radio-button>
      <el-radio-button label="vertical"></el-radio-button>
    </el-radio-group>
    <FatForm :initial-value="initialValue" :layout="layout" :submit="handleSubmit">
      <FatFormItem label="姓名(a,b)" prop="a.b" initial-value="bbb" />
      <FatFormItem label="年龄(a.d)" prop="a.d" />
      <FatFormItem label="身份证(b.a)" prop="b.a" initial-value="b.a" />
      <FatFormConsumer v-slot="scope">{{ JSON.stringify(scope.values) }}</FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
  import { ref } from 'vue';

  const layout = ref<any>('inline');

  const initialValue = {
    a: {
      b: 1,
      c: 2,
    },
  };

  const handleSubmit = async (values: any) => {
    console.log('submit', values);
  };
</script>
