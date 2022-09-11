<template>
  <div>
    <div>#DrawerDefine</div>
    <DrawerDefine ref="drawer" />
    <button @click="show">show drawer</button>
    <ModalDefine ref="modal" />
    <button @click="showModal">show modal</button>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import DrawerDefine from './DrawerDefine';
  import ModalDefine from './ModalDefine';

  const drawer = ref();
  const modal = ref();

  const show = () => {
    console.log(drawer);
    drawer.value?.open();
  };

  const showModal = () => {
    console.log(modal);
    modal.value?.open();
  };
</script>
