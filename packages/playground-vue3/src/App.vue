
<template>
  <div id="app">
    <nav><router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |</nav>
    <router-view />
  </div>
</template>


<script lang="ts" setup>
</script>

<style lang="scss">

  // 自定义命名空间
  // element-plus 建议使用 css variable 变量定义: https://element-plus.gitee.io/zh-CN/guide/theming.html#%E9%80%9A%E8%BF%87-css-%E5%8F%98%E9%87%8F%E8%AE%BE%E7%BD%AE
  @import '../node_modules/element-plus/theme-chalk/src/index.scss';



  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  nav {
    padding: 30px;

    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
