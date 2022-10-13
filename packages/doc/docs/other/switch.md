# FatSwitch 开关

`@wakeadmin/components` 移植了 `element-plus` 的 `el-switch` 组件。如果你想要在 `element-ui` 中使用 `inline-prompt`、`loading`、`beforeChange` 等特性，可以使用这个组件。

<br>
<br>
<br>

<script setup>
  import {FatSwitch} from '@wakeadmin/components'
  import {ref} from 'vue'

  const active = ref(true)

</script>

<ClientOnly>
  <div class="wk-demo">
    <FatSwitch v-model="active" />
  </div>
</ClientOnly>

::: details 查看代码

```vue
<template>
  <FatSwitch v-model="active" />
</template>

<script setup>
  import { FatSwitch } from '@wakeadmin/components';
  import { ref } from 'vue';

  const active = ref(true);
</script>
```

:::

<br>
<br>
<br>

## API

见[element-plus](https://element-plus.gitee.io/zh-CN/component/switch.html#%E5%B1%9E%E6%80%A7)

<br>

::: warning 注意事项
`size` 仅支持默认和 `small`
:::
