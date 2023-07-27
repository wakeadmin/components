<template>
  <div class="wk-demo">
    <FatImport :after-upload="afterUpload">
      <template #message> 导入规则：请先下载 导入模板，在模板中按要求填写信息，然后上传该文件 </template>
      <template #uploadMessage>*只能上传xlsc、xls格式文件，单次最多支持导入2千条数据</template>
      <Button>批量导入</Button>
    </FatImport>
  </div>
</template>

<script lang="ts" setup>
  import { FatImportErrorResult, FatImport } from '@wakeadmin/components';

  const afterUpload = async () => {
    return {
      status: 'error',
      message: '上传失败',
      details: new Array(100).fill(0).map((i, idx) => {
        return { row: idx, reason: 'hhh' + idx };
      }),
    } as FatImportErrorResult;
  };
</script>
