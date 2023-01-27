<template>
  <ElDrawer v-model="show"> 花谢花开花满天，红消香断有谁怜 </ElDrawer>
</template>

<script setup>
  import { ElDrawer } from 'element-plus';
  import { ref, defineExpose, inject, onUnmounted } from 'vue';

  const show = ref(false);
  console.log(inject('S', '???'));

  onUnmounted(() => {
    console.log('destroy');
  });
  defineExpose({
    open: () => (show.value = true),
    close: () => (show.value = false),
  });
</script>
