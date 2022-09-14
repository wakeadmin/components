<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts" setup>
  import { provideFatConfigurable } from '@wakeadmin/components';

  provideFatConfigurable({
    aImagesProps: {
      action: '/upload-demo',
      filter: item => {
        // 处理服务端响应
        if (item.response) {
          item.url = '/' + item.response.id;
        }

        return true;
      },
    },
  });
</script>

<style lang="scss">
  // 可以在这里定义 element-ui 变量: https://element.eleme.io/#/zh-CN/component/custom-theme
  $--color-primary: teal;

  /* 改变 icon 字体路径变量，必需 */
  $--font-path: '~element-ui/lib/theme-chalk/fonts';

  @import '~element-ui/packages/theme-chalk/src/index';

  body {
    padding: 0;
    margin: 0;
  }
</style>
