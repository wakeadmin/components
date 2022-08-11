<template>
  <div id="app">
    <nav><router-link to="/">Home</router-link> | <router-link to="/about">About</router-link> |</nav>
    <el-button type="primary">hello</el-button>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
  import { Button as ElButton } from '@wakeadmin/component-adapter';
</script>

<style lang="scss">
  // 可以在这里定义 element-ui 变量: https://element.eleme.io/#/zh-CN/component/custom-theme
  $--color-primary: teal;

  /* 改变 icon 字体路径变量，必需 */
  $--font-path: '~element-ui/lib/theme-chalk/fonts';

  @import '~element-ui/packages/theme-chalk/src/index';

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
