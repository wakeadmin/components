<template>
  <div class="container">
    <FatHeader>
      <template #title> title </template>
      content
    </FatHeader>

    <FatHeader
      :tabs="[
        { key: '1', title: '新增' },
        { key: '2', title: '删除' },
      ]"
      style="margin-top: 30px"
    >
      <template #title> title </template>
      content
    </FatHeader>
  </div>
</template>

<script lang="tsx" setup>
  import { FatHeader } from '@wakeadmin/components';
</script>

<style scoped>
  .container {
    background-color: gray;
    padding: 20px;
  }
</style>
