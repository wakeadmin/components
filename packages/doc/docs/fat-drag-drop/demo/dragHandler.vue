<template>
  <div>
    <FatDragItem class="inline-block">
      <FatDragHandler class="handler"> 🐇 </FatDragHandler>
      <span>点火樱桃，照一架、荼蘼如雪 </span>
    </FatDragItem>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem, FatDragHandler } from '@wakeadmin/components';
</script>
<style lang="scss" scoped>
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    box-sizing: border-box;
  }
  .handler {
    cursor: move;
  }
</style>
