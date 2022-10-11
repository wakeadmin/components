<template>
  <FatContainer
    title="页面标题"
    :tabs="[
      { key: 'one', title: 'Hello' },
      { key: 'two', title: 'World' },
    ]"
  >
    <template #query>
      <div class="block" style="height: 200px">这里可以放置查询表单</div>
    </template>
    <div class="block">这里可以放置页面主体内容</div>
  </FatContainer>
</template>

<script lang="tsx" setup>
  import { FatContainer } from '@wakeadmin/components';
</script>

<style lang="scss" scoped>
  .block {
    width: 100%;
    background-color: rgba(255, 145, 0, 0.5);
    height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
