<template>
  <div class="container">
    <button @click="showModal('edit')">编辑</button>
    <button @click="showModal('add')">新增</button>

    <button @click="showDrawer('edit')">编辑 drawer</button>
    <button @click="showDrawer('add')">新增 drawer</button>
    <FatFormPage :enable-reset="false" @cancel="handleCancel">
      <template #title>你好世界</template>
      <div>same time</div>
      ok
      <FatFormSection title="分组1">
        <FatFormItem
          prop="name"
          label="名称"
          message="必须合法"
          width="medium"
          :rules="{ required: true }"
        ></FatFormItem>
        <FatFormItem prop="age" label="年龄" width="huge" message="不能超过 18" inline-message></FatFormItem>
        <FatFormGroup message="分组消息">
          <FatFormItem prop="id" label="身份证" message="必须合法" width="medium"></FatFormItem>
          <FatFormItem prop="address" label="地址" width="huge"></FatFormItem>
        </FatFormGroup>
      </FatFormSection>
      <FatFormSection title="分组2">
        <FatFormItem
          prop="name"
          label="名称"
          message="必须合法"
          width="medium"
          :rules="{ required: true }"
        ></FatFormItem>
        <FatFormItem prop="age" label="年龄" width="huge" message="不能超过 18" inline-message></FatFormItem>
        <FatFormGroup message="分组消息">
          <FatFormItem prop="id" label="身份证" message="必须合法" width="medium"></FatFormItem>
          <FatFormItem prop="address" label="地址" width="huge"></FatFormItem>
        </FatFormGroup>
      </FatFormSection>
    </FatFormPage>
    <FatFormModal ref="modal" enable-reset :submit="handleSubmit" @finish="handleFinish">
      <FatFormItem prop="name" label="名称" message="必须合法" width="medium" :rules="{ required: true }"></FatFormItem>
      <FatFormItem prop="age" label="年龄" width="huge"></FatFormItem>
      <FatFormGroup>
        <FatFormItem prop="id" label="身份证" message="必须合法" width="medium"></FatFormItem>
        <FatFormItem prop="address" label="地址" width="huge"></FatFormItem>
      </FatFormGroup>
    </FatFormModal>
    <FatFormDrawer ref="drawer" enable-reset :submit="handleSubmit" drawer-size="50%" @finish="handleFinish">
      <FatFormItem prop="name" label="名称" message="必须合法" width="medium" :rules="{ required: true }"></FatFormItem>
      <FatFormItem prop="age" label="年龄" width="huge"></FatFormItem>
      <FatFormGroup>
        <FatFormItem prop="id" label="身份证" message="必须合法" width="medium"></FatFormItem>
        <FatFormItem prop="address" label="地址" width="huge"></FatFormItem>
      </FatFormGroup>
    </FatFormDrawer>
    <div>
      <h1>query</h1>
      <FatForm layout="inline" submitter-style="margin-left: 50px">
        <FatFormItem label="订单编号" prop="a"></FatFormItem>
        <FatFormItem label="订单退款情况" prop="b"></FatFormItem>
        <FatFormItem label="营销类型" prop="c"></FatFormItem>
        <FatFormItem label="提货方式" prop="d"></FatFormItem>
        <FatFormItem label="支付单号" prop="e"></FatFormItem>
        <FatFormItem label="第三方支付单号" prop="e"></FatFormItem>
        <FatFormItem label="支付方式" prop="e"></FatFormItem>
        <FatFormItem label="商品名称" prop="e"></FatFormItem>
      </FatForm>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import {
    FatFormPage,
    FatForm,
    FatFormSection,
    FatFormModal,
    FatFormModalMethods,
    FatFormDrawer,
    FatFormDrawerMethods,
    FatFormItem,
    FatFormGroup,
  } from '@wakeadmin/components';
  import { ref } from 'vue';

  const handleSubmit = async (values: any) => {
    console.log('submit', values);
  };

  const handleFinish = (values: any, close: Function) => {
    console.log('finish', values);

    close();
  };

  const modal = ref<FatFormModalMethods<any>>();

  const showModal = (type: 'add' | 'edit') => {
    modal.value?.open(type === 'add' ? { title: '新增' } : { title: '编辑', initialValue: { name: 'ivan lee' } });
  };

  const drawer = ref<FatFormDrawerMethods<any>>();

  const showDrawer = (type: 'add' | 'edit') => {
    drawer.value?.open(type === 'add' ? { title: '新增' } : { title: '编辑', initialValue: { name: 'ivan lee' } });
  };

  const handleCancel = () => {
    console.log('cancel');
  };
</script>

<style lang="scss" scoped>
  .container {
    background-color: #f5f7fa;
    width: 100%;
    box-sizing: border-box;
    min-height: 100vh;
    padding: 20px;
  }
</style>
