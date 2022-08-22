<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
  // 可以在这里定义 element-ui 变量: https://element.eleme.io/#/zh-CN/component/custom-theme
  $--color-primary: teal;

  /* 改变 icon 字体路径变量，必需 */
  $--font-path: '~element-ui/lib/theme-chalk/fonts';

  @import '~element-ui/packages/theme-chalk/src/index';
</style>
