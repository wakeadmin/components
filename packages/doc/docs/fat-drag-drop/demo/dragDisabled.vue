<template>
  <div>
    <div>
      <ElButton @click="toggleAllowDrag">切换状态</ElButton>
    </div>
    <FatDragItem class="inline-block" :class="{ disabled: allowDrag }" :disabled="allowDrag">
      <span> 始围寸而高尺，今连拱而九成 </span>
    </FatDragItem>
  </div>
</template>
<script setup lang="ts">
  import { ElButton } from 'element-plus';
  import { FatDragItem } from '@wakeadmin/components';
  import { ref } from 'vue';

  const allowDrag = ref(false);
  const toggleAllowDrag = () => {
    allowDrag.value = !allowDrag.value;
  };
</script>
<style lang="scss" scoped>
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    margin: 12px;
    box-sizing: border-box;
    cursor: move;
    &.disabled {
      cursor: not-allowed;
    }
  }
</style>
