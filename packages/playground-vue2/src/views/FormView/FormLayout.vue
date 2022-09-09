<template>
  <div>
    <div>#DrawerDefine</div>
    <DrawerDefine ref="drawer" />
    <button @click="show">show drawer</button>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import DrawerDefine from './DrawerDefine';

  const drawer = ref();

  const show = () => {
    console.log(drawer);
    drawer.value?.open();
  };
</script>
