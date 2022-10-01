---
layout: false
---

<script setup>
  import FloatFooter from './FloatFooter.vue'

</script>

<ClientOnly>
  <div class="demo">
    <FloatFooter />
  </div>
</ClientOnly>

<style scoped>
  .demo {
    width: 100vw;
    height: 100vh;
    background-color: gray;
  }
</style>
