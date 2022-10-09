<script setup>
  import Icon from './Icon.vue'
</script>

# FatIcon

`FatIcon` 用于包裹 svg 组件，从而方便地设置尺寸、颜色。

## 示例

<ClientOnly>
  <div class="wk-demo"><Icon /></div>
</ClientOnly>

::: details 查看代码
<<< @/other/Icon.vue
:::

<br>
<br>
<br>
<br>

### API

| name                    | description                                                                                | default           |
| ----------------------- | ------------------------------------------------------------------------------------------ | ----------------- |
| color?                  | 颜色，可以是预定义颜色(primary, secondary, success, danger, warning, info), 或者自定义颜色 | inherit           |
| size?: string \| number | 尺寸                                                                                       | inherit(字体颜色) |
| loading?: boolean       | 加载动画                                                                                   | false             |
| left?: boolean          | 在右侧留出间距                                                                             | false             |
| right?: boolean         | 在左侧留出间距                                                                             | false             |
