<template>
  <div @click="handleClick">ok</div>
</template>

<script setup lang="tsx">
  defineProps<{ foo?: boolean; color: string }>();

  const emit = defineEmits<{
    (e: 'change', id: number): void;
    (e: 'update', value: string): void;
  }>();

  const handleClick = () => {
    console.log('click');
    emit('update', 'string');
  };
</script>
