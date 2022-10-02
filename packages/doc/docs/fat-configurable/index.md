# FatConfigurable 约定大于配置

我们的组件库秉承 “约定大于配置” 的原则，主导开箱即用。即使需要定制，我们也建议在全局将这些配置固化下来，形成规范，在应用范围内保持统一。

<br>
<br>

## 配置

配置有两种方式：

### 1. FatConfigurableProvider 组件

```vue
<template>
  <FatConfigurableProvider :value="config">
    <router-view></router-view>
  </FatConfigurableProvider>
</template>

<script setup>
  import { FatConfigurableProvider } from '@wakeadmin/components';

  const config = {
    /*...*/
  }; // 也支持 ref， computed. 比如你需要支持 多语言
</script>
```

<br>
<br>
<br>

### 2. provideFatConfigurable() Composition API

```vue
<script setup>
  import { provideFatConfigurable } from '@wakeadmin/components';

  const config = {
    /*...*/
  }; // 也支持 ref， computed. 比如你需要支持 多语言

  provideFatConfigurable(config);
</script>
```

<br>
<br>
<br>

## 配置项

FatConfigurable 支持一些通用配置项，以及所有[内置原件](../atomics/index.md)的 props 配置。

<br>

![](./images/fat-configurable.png)

<br>
<br>
<br>
