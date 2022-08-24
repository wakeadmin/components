<template>
  <div>
    <el-radio-group v-model="layout">
      <el-radio-button label="inline"></el-radio-button>
      <el-radio-button label="horizontal"></el-radio-button>
      <el-radio-button label="vertical"></el-radio-button>
    </el-radio-group>
    <FatSpace style="color: red" :size="100"
      >12
      <div>32</div>
    </FatSpace>
    <FatForm ref="formRef" :initial-value="initialValue" :layout="layout" :submit="handleSubmit" label-width="100px">
      <FatFormItem label="姓名(a,b)" prop="a.b" initial-value="bbb" />
      <FatFormItem label="年龄(a.d)" prop="a.d" :rules="{ required: true }" />
      <FatFormItem label="身份证(b.a)" prop="b.a" initial-value="b.a" />
      <FatFormItem :hidden="true" label="隐藏" prop="a.c" />
      <FatFormItem label="密码" prop="password" :rules="[{ required: true }]" />
      <FatFormGroup label="网格" :disabled="true" required :row="{ justify: 'center' }">
        <FatFormItem class="my-item" :col="{ span: 11 }" prop="col[0]" :rules="[{ required: true }]"></FatFormItem>
        <FatFormItem :col="{ span: 11 }" prop="col[1]"></FatFormItem>
      </FatFormGroup>
      <FatFormGroup label="网格2">
        <FatFormItem class="my-item" prop="col[0]" :rules="[{ required: true }]"></FatFormItem>
        <FatFormItem prop="col[1]"></FatFormItem>
      </FatFormGroup>
      <FatFormGroup>
        <FatFormItem class="my-item" label="网格1" prop="col[0]" :rules="[{ required: true }]"></FatFormItem>
        <FatFormItem prop="col[1]" label="网格2"></FatFormItem>
        <FatFormGroup>
          <FatFormItem width="huge" class="my-item" prop="c" />
        </FatFormGroup>
      </FatFormGroup>
      <FatFormItem
        label="确认密码"
        prop="passwordConfirm"
        message="很重要"
        :inline-message="true"
        :rules="rulesForConfirmPassword"
        dependencies="password"
        :disabled="f => f.form.values.password === 'disabled'"
      />
      <FatFormGroup label-width="auto">
        <button type="submit">submit</button>
      </FatFormGroup>
      <FatFormConsumer v-slot="scope">
        <div>
          {{ JSON.stringify(scope.values) }}
        </div>
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script lang="tsx" setup>
  import { FatForm, FatSpace, FatFormItem, FatFormConsumer, FatFormMethods, FatFormGroup } from '@wakeadmin/components';
  import { ref } from 'vue';

  const formRef = ref<FatFormMethods<any>>();
  const layout = ref<any>('horizontal');

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
