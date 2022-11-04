# FatVNode VNode 渲染

JSX 的渲染结果是不能直接在 template 上渲染的，因此我们提供了 FatVNode 辅助渲染。**不过大部分情况下，我们还是推荐开发者遵循 Vue 的最佳实践，优先使用模板的能力**。

<br>
<br>

## 示例

<script setup>
  import VNodeRender from './VNodeRender.vue'

</script>

<br>

<ClientOnly>
  <div class="wk-demo"><VNodeRender /></div>
</ClientOnly>

::: details 查看代码
<<< @/other/VNodeRender.vue
:::
