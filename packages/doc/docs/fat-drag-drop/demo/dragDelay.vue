<template>
  <div>
    <FatDragItem class="inline-block" :drag-delay="500">
      <span> 一星如月看多时 </span>
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
