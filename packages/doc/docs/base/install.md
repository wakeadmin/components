# 开始

<br>

[[toc]]

<br>
<br>
<br>
<br>

`@wakeadmin/components` 是基于 Vue 和 `Element-UI`/`Element-plus` 的高级组件库。旨在解放管理后台端 CRUD 页面的前端生产力。

<br>
<br>
<br>

## 整体架构

![](./images/arch.png)

<br>

- `element-adapter`: 这里主要用于封装 element-ui/element-plus 之间的一些差异。 `@wakeadmin/components` 不会直接依赖 element-ui/element-plus, 而是使用 element-adapter 暴露的统一 API
- `@wakeadmin/h`/`@wakeadmin/demi`: 这是一个 JSX 库，屏蔽了 Vue 2/3 在视图渲染上的一些差异，从而让 `@wakeadmin/components` 兼容 Vue 2/3。

<br>
<br>
<br>

**主要内容：**

![](./images/content.png)

<br>

`@wakeadmin/components` 包含三大核心部件：

- `FatTable`: 用于常见的列表、表格查询页面
- `FatForm`: 用于常见的创建表单、更新表单、表单详情等页面
- `原件(Atomics)`: 原件是组成 FatTable、FatForm 的基本单位，为不同**数据类型**定义*编辑*和*预览*的视图。

<br>
<br>
<br>
<br>

## Prerequisites

<br>
<br>

`@wakeadmin/components` 支持 Vue 2/3:

- **Vue 2**: 要求 **Vue 2.7.13+**, element-ui 2.14+
- **Vue 3**: Vue 3.0+, element-plus 2.2+

<br>

::: warning
注意，Vue 2 下，仅支持 2.7.13+，请升级到最新的 Vue 2 版本。并移除旧的 `@vue/composition-api`
:::

<br>
<br>
<br>
<br>

## 安装

<br>

```shell
$ pnpm add @wakeadmin/components
```

<br>
<br>

:::tip 如果你使用的是 vue-cli，建议在 vue.config.js 中加入以下配置:

```js
// ...
module.exports = defineConfig({
  // 构建时转换 @wakeadmin/* 相关库，让 babel 参与转译，以符合你的兼容性需求
  transpileDependencies: process.env.NODE_ENV === 'production' ? [/(wakeapp|wakeadmin)/] : false,
  // ...
});
```

:::

<br>
<br>
<br>
<br>

## 更好的 Typescript / JSX 支持

在 Vue 中支持 Typescript 和 JSX 并不是一件容易的事情，移步[支持 Typescript 和 JSX](./typescript.md), 我们专门写的一篇文档。

<br>
<br>
<br>

## 初始化

引入样式，并安装 Vue 插件:

```tsx
import Vue from 'vue';
import { plugin } from '@wakeadmin/components';

// 引入样式
import '@wakeadmin/components/style/index.scss';

// vue 2.x 用法
Vue.use(plugin);
```

<br>
<br>
<br>

::: tip 如果你使用 element-plus, 且使用了[自定义命名空间](https://element-plus.gitee.io/zh-CN/guide/namespace.html)
`@wakeadmin/components` 定制了部分 element 组件的样式，因此如果你使用自定义命名空间，在导入 @wakeadmin/components 的样式时，同样需要配置一下命名空间变量:

创建一个 新的 scss 文件，或者在`应用根组件` 的 `<style lang="scss">` 中添加以下代码:

```vue
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
```

:::

<br>
<br>
<br>
<br>

## 开启编程之旅

<br>
<br>
<br>
<br>

开发一个简单的表格：

```tsx
import { defineFatTable } from '@wakeadmin/components';

/**
 * 表格项类型
 */
export interface Item {
  id: number;
  name: string;
  createDate: number;
}

export const MyTable = defineFatTable<Item>(({ column }) => {
  return () => ({
    // 表格数据获取
    async request(params) {
      const { pagination, query } = params;

      const { data: list, total } = await getMyList({ ...query, ...pagination });

      return {
        total,
        list,
      };
    },
    // 删除操作
    async remove(list, ids) {
      await removeItem(ids);
    },
    // 表格列
    columns: [
      // queryable 标记为查询字段
      column({ prop: 'name', label: '名称', queryable: true }),
      column({ prop: 'createDate', valueType: 'date-range', label: '创建时间', queryable: true }),
      column({
        type: 'actions',
        actions: (table, row) => [{ name: '编辑' }, { name: '删除', onClick: () => table.remove(row) }],
      }),
    ],
  });
});
```
