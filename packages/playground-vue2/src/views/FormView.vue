<template>
  <div>
    <el-radio-group v-model="layout">
      <el-radio-button label="inline"></el-radio-button>
      <el-radio-button label="horizontal"></el-radio-button>
      <el-radio-button label="vertical"></el-radio-button>
    </el-radio-group>
    <FatForm ref="formRef" :initial-value="initialValue" :layout="layout" :submit="handleSubmit">
      <FatFormItem label="姓名(a,b)" prop="a.b" initial-value="bbb" />
      <FatFormItem label="年龄(a.d)" prop="a.d" :rules="{ required: true }" />
      <FatFormItem label="身份证(b.a)" prop="b.a" initial-value="b.a" />
      <FatFormItem label="密码" prop="password" :rules="[{ required: true }]" />
      <FatFormItem label="确认密码" prop="passwordConfirm" :rules="rulesForConfirmPassword" dependencies="password" />
      <FatFormConsumer v-slot="scope">{{ JSON.stringify(scope.values) }}</FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer, FatFormMethods } from '@wakeadmin/components';
  import { ref } from 'vue';

  const formRef = ref<FatFormMethods<any>>();
  const layout = ref<any>('inline');

  const initialValue = {
    a: {
      b: 1,
      c: 2,
    },
  };

  const rulesForConfirmPassword = [
    { required: true },
    {
      validator(rule: any, value: any, callback: any) {
        if (value !== formRef.value?.values.password) {
          callback(new Error('密码不匹配'));
        } else {
          callback();
        }
      },
    },
  ];

  const handleSubmit = async (values: any) => {
    console.log('submit', values);
  };
</script>
