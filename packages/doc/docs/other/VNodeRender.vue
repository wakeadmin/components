<template>
  <FatVNode :vnode="sample1" />
  <FatVNode :vnode="sample2(72)" />
</template>

<script setup lang="tsx">
  import { FatVNode } from '@wakeadmin/components';

  const sample1 = <div>“996”工作制，即每天早 9 点到岗，一直工作到晚上 9 点，每周工作 6 天。</div>;

  const sample2 = (value: number) => <div>“996”工作制的周工作时间为最低 12x6={value} 小时。</div>;
</script>
