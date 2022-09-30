<template>
  <FatForm ref="formRef" :initial-value="initialValue">
    <FatFormConsumer v-slot="form">
      <FatFormGroup label="动态列表" vertical>
        <FatFormGroup v-for="(item, index) of form.values.list" :key="item.key">
          <FatFormItem :prop="`list[${index}].name`" placeholder="名称"></FatFormItem>
          <FatFormItem :prop="`list[${index}].note`" placeholder="备注"></FatFormItem>
          <el-button @click="handleRemove(item.key)">删除</el-button>
        </FatFormGroup>
        <el-button @click="handleAdd">新增</el-button>
      </FatFormGroup>
    </FatFormConsumer>
    <FatFormItem label="显示隐藏字段" prop="visible" value-type="checkbox"></FatFormItem>
    <FatFormConsumer v-slot="form">
      <FatFormItem
        v-if="form.values.visible"
        label="我是隐藏字段"
        prop="hidden"
        initial-value="hidden"
        width="medium"
        :preserve="false"
      ></FatFormItem>
    </FatFormConsumer>
    <FatFormGroup label="数据">
      <FatFormConsumer v-slot="form">
        <pre><code>{{JSON.stringify(form.values, null, 2)}}</code></pre>
      </FatFormConsumer>
    </FatFormGroup>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormGroup, FatFormConsumer, FatFormItem, useFatFormRef } from '@wakeadmin/components';

  interface S {
    list: { name: string; note: string; key: number }[];
  }

  const formRef = useFatFormRef<S>();
  let uid = 0;

  const initialValue = {
    list: [],
  };

  const handleAdd = () => {
    formRef.value?.values.list.push({ name: '', note: '', key: uid++ });
  };

  const handleRemove = (key: number) => {
    const idx = formRef.value?.values.list.findIndex(i => i.key === key);
    if (idx != null && idx !== -1) {
      formRef.value?.values.list.splice(idx, 1);
    }
  };
</script>
