<template>
  <el-config-provider namespace="ep">
    <div id="app">
      <router-view />
    </div>
  </el-config-provider>
</template>

<script lang="ts" setup></script>

<style lang="scss">
  // 自定义命名空间
  @forward 'element-plus/theme-chalk/src/mixins/config.scss' with (
    $namespace: 'ep'
  );

  @use 'element-plus/theme-chalk/src/index.scss' as *;

  // 定义 @wakeadmin/components 下的 element-ui 命名空间
  @forward '@wakeadmin/components/style/_config.scss' with (
    $el-ns: 'ep'
  );

  @use '@wakeadmin/components/style/index.scss' as *;

  body {
    margin: 0;
    padding: 0;
  }
</style>
