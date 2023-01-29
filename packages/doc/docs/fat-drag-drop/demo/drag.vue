<template>
  <div>
    <FatDragItem class="inline-block">
      <span> 愿天上人间，占得欢娱 </span>
    </FatDragItem>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem } from '@wakeadmin/components';
</script>
<style lang="scss" scoped>
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    box-sizing: border-box;
    cursor: move;
  }
</style>
