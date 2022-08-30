<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <section><InitialValue></InitialValue></section>
    <section><Layout></Layout></section>
  </main>
</template>

<script lang="tsx" setup>
  import Layout from './Layout.vue';
  import InitialValue from './InitialValue.vue';
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
