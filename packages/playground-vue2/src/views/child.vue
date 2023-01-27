<template>
  <div>一叶叶 一声声 空阶滴到明</div>
</template>
<script setup>
  import { onUnmounted } from 'vue';

  defineExpose({
    say: () => console.log('S'),
  });

  onUnmounted(() => {
    console.log('destroy');
  });
</script>
