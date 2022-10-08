<template>
  <div>
    <FatAtomic v-model="value" @blur="handleBlur" />
    <FatAtomic v-model="selectValue" value-type="select" :options="[{ label: 'one', value: 0 }]" />
  </div>
</template>

<script setup lang="tsx">
  import { FatAtomic } from '@wakeadmin/components';
  import { ref } from 'vue';

  const value = ref('');
  const handleBlur = () => {
    console.log('blur');
  };

  const selectValue = ref(0);
</script>
