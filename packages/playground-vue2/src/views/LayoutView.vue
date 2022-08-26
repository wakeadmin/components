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

    <FatContent>
      <div>hello</div>
      <div>world</div>
    </FatContent>

    <FatFloatFooter>submit</FatFloatFooter>
  </div>
</template>

<script lang="tsx" setup>
  import { FatHeader, FatFloatFooter, FatContent } from '@wakeadmin/components';
</script>

<style scoped>
  .container {
    background-color: gray;
    padding: 20px;
    position: relative;
    margin-left: 200px;
  }
</style>
