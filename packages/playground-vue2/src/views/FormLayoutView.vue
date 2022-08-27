<template>
  <div class="container">
    <button @click="showModal('edit')">编辑</button>
    <button @click="showModal('add')">新增</button>
    <FatFormPage :enable-reset="false" @cancel="handleCancel">
      <template #title>你好世界</template>
      <FatFormSection title="分组1">
        <FatFormItem
          prop="name"
          label="名称"
          message="必须合法"
          width="medium"
          :rules="{ required: true }"
        ></FatFormItem>
        <FatFormItem prop="age" label="年龄" width="huge"></FatFormItem>
        <FatFormGroup>
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
  </div>
</template>

<script lang="tsx" setup>
  import {
    FatFormPage,
    FatFormSection,
    FatFormModal,
    FatFormModalMethods,
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
