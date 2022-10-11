<template>
  <FatCard>
    <template #title> 标题 </template>
    <template #extra>
      <el-button>按钮</el-button>
      <el-button type="primary">按钮</el-button>
    </template>
    <div class="block"></div
  ></FatCard>
</template>

<script lang="tsx" setup>
  import { FatCard } from '@wakeadmin/components';
</script>

<style lang="scss" scoped>
  .block {
    height: 200px;
    background-color: rgba(255, 145, 0, 0.5);
  }
</style>
