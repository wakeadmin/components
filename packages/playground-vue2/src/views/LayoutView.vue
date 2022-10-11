<template>
  <div class="container">
    <FatContainer>
      <template #title> title </template>
      content
    </FatContainer>

    <FatContainer
      :tabs="[
        { key: '1', title: '新增' },
        { key: '2', title: '删除' },
      ]"
      style="margin-top: 30px"
    >
      <template #title> title </template>
      content
    </FatContainer>

    <FatContent>
      <div>hello</div>
      <div>world</div>
    </FatContent>

    <FatFloatFooter>submit</FatFloatFooter>
  </div>
</template>

<script lang="tsx" setup>
  import { FatContainer, FatFloatFooter, FatContent } from '@wakeadmin/components';
</script>

<style scoped>
  .container {
    background-color: gray;
    padding: 20px;
    position: relative;
    margin-left: 200px;
  }
</style>
