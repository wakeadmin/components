<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <div># inline</div>
    <FatForm layout="inline">
      <FatFormItem prop="a" label="名称"></FatFormItem>
      <FatFormItem prop="b" label="姓名"></FatFormItem>
      <FatFormItem prop="c" label="收货地址"></FatFormItem>
      <FatFormItem prop="d" label="手机号码"></FatFormItem>
    </FatForm>

    <div># col 统一对齐</div>
    <FatForm layout="inline" :col="{ xl: 4, lg: 6, sm: 8 }">
      <FatFormItem prop="a" label="名称"></FatFormItem>
      <FatFormItem prop="b" label="姓名"></FatFormItem>
      <FatFormItem prop="c" label="收货地址"></FatFormItem>
      <FatFormItem prop="d" label="手机号码"></FatFormItem>
    </FatForm>

    <div>混合</div>

    <el-radio-group v-model="layout">
      <el-radio-button label="inline"></el-radio-button>
      <el-radio-button label="horizontal"></el-radio-button>
      <el-radio-button label="vertical"></el-radio-button>
    </el-radio-group>

    <div>
      <button @click="changeInitialValue">修改 initialValue</button>
    </div>

    <FatForm ref="formRef" :initial-value="initialValue" :layout="layout" :submit="handleSubmit">
      <FatFormItem label="姓名(a,b)" prop="a.b" initial-value="bbb" />
      <FatFormItem label="年龄(a.d)" prop="a.d" :rules="{ required: true }" />
      <FatFormItem label="身份证(b.a)" prop="b.a" initial-value="b.a.aa" />
      <FatFormItem label="很长的标签（a.c）" prop="a.c" />
      <FatFormItem :hidden="true" label="隐藏" prop="a.c" />
      <FatFormItem label="密码" prop="password" :rules="[{ required: true }]" message="很重要" />
      <FatFormGroup
        label="网格"
        :disabled="true"
        required
        :row="{ justify: 'center' }"
        message="很重要"
        :inline-message="true"
      >
        <FatFormItem
          class="my-item"
          :col="{ span: 11 }"
          initial-value="1"
          prop="col[0]"
          :rules="[{ required: true }]"
        ></FatFormItem>
        <FatFormItem :col="{ span: 11 }" initial-value="2" prop="col[1]"></FatFormItem>
      </FatFormGroup>
      <FatFormGroup label="网格2" message="很重要" :inline-message="true" tooltip="提示很重要">
        <FatFormItem class="my-item" prop="col[0]" :rules="[{ required: true }]"></FatFormItem>
        <FatFormItem prop="col[1]"></FatFormItem>
      </FatFormGroup>
      <FatFormGroup message="很重要">
        <FatFormItem class="my-item" label="网格1" prop="col[0]" :rules="[{ required: true }]"></FatFormItem>
        <FatFormItem prop="col[1]" label="网格2"></FatFormItem>
        <FatFormGroup>
          <FatFormItem width="mini" class="my-item" prop="c" />
          你好
          <FatFormItem width="mini" class="my-item" prop="c" />
          <FatFormItem prop="e" value-type="switch" />
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
      <FatFormItem prop="withoutLabel" label-width="auto"></FatFormItem>
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
  import { FatForm, FatFormItem, FatFormConsumer, FatFormMethods, FatFormGroup } from '@wakeadmin/components';
  import { ref, shallowRef } from 'vue';

  const formRef = ref<FatFormMethods<any>>();
  const layout = ref<any>('horizontal');

  const initialValue = shallowRef({
    a: {
      b: 1,
      c: 2,
    },
  });

  const changeInitialValue = () => {
    initialValue.value = {
      a: {
        b: 2,
        c: 4,
      },
    };
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
    throw new Error('fuck');
  };
</script>
