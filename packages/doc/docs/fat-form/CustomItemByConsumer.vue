<template>
  <FatForm :enable-submitter="false">
    <FatFormItem label="姓名" prop="name" width="medium"></FatFormItem>
    <FatFormConsumer v-slot="scope">
      <el-form-item label="年龄">
        <el-input-number
          :model-value="scope.getFieldValue('age')"
          @update:model-value="scope.setFieldValue('age', $event)"
        />
      </el-form-item>
    </FatFormConsumer>
    <FatFormConsumer v-slot="scope">
      <el-form-item label="JSON">
        {{ JSON.stringify(scope.values, null, 2) }}
      </el-form-item>
    </FatFormConsumer>
  </FatForm>
</template>

<script lang="tsx" setup>
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
</script>
