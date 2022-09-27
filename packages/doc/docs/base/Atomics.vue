<template>
  <div class="wk-demo">
    <el-switch v-model="previewMode" active-text="预览" inactive-text="编辑"></el-switch>

    <FatForm :mode="previewMode ? 'preview' : 'editable'">
      <FatFormItem prop="input" label="文本输入" initial-value="123" />
      <FatFormItem prop="integer" value-type="integer" label="整数输入" :initial-value="456" />
      <FatFormItem prop="date" value-type="date" label="日期输入" />
      <FatFormConsumer>
        <template #default="scope">
          <pre><code>{{ JSON.stringify(scope.values, undefined, 2) }}</code></pre>
        </template>
      </FatFormConsumer>
    </FatForm>
  </div>
</template>

<script setup lang="tsx">
  import { FatForm, FatFormItem, FatFormConsumer } from '@wakeadmin/components';
  import { ref } from 'vue';

  const previewMode = ref(false);
</script>
