<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss">
  // 自定义命名空间
  // element-plus 建议使用 css variable 变量定义: https://element-plus.gitee.io/zh-CN/guide/theming.html#%E9%80%9A%E8%BF%87-css-%E5%8F%98%E9%87%8F%E8%AE%BE%E7%BD%AE
  @import '../node_modules/element-plus/theme-chalk/src/index.scss';
</style>
