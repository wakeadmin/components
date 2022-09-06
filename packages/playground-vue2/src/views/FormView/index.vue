<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <section><Atomics /></section>
    <section><InitialValue></InitialValue></section>
    <section><Layout></Layout></section>
    <section><Nested></Nested></section>
    <section><Transform></Transform></section>
  </main>
</template>

<script lang="tsx" setup>
  import Layout from './Layout.vue';
  import InitialValue from './InitialValue.vue';
  import Atomics from './Atomics.vue';
  import Nested from './Nested.vue';
  import Transform from './Transform.vue';
</script>

<style lang="scss" scoped>
  main {
    background-color: #f5f7fa;
    padding: 20px;
  }

  section {
    background-color: white;
    padding: 20px;
    &:not(:first-child) {
      margin-top: 40px;
    }
  }
</style>
