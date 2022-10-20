<template>
  <div>
    <ByDefineComponent ref="refInstance" foo @ok="handleOk" />
    <BySPA ref="refInstance" color="hello" @change="handleOk" />
    <ByDeclareComponent ref="refInstance" foo="x" @ok="handleOk" />
    <el-button type="primary"></el-button>
  </div>
</template>

<script setup lang="tsx">
  import { ref } from 'vue';
  import ByDefineComponent from './ByDefineComponent';
  import BySPA from './BySPA.vue';
  import ByDeclareComponent from './ByDeclareComponent';

  const refInstance = ref();

  const handleOk = () => {
    console.log('ok');
  };
</script>
