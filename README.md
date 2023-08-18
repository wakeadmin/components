# wakeadmin 组件库

> 当前项目正处于开发中，欢迎大家提出宝贵的意见和建议，我们会认真对待，谢谢！

> 当前组件库可能耦合了惟客的 UI 风格，你可以 Fork 并修改成你自己的风格

<br>

`@wakeadmin/components` 是惟客数据针对管理后台开发的一套基于 Vue.js 和 Element ui 的组件库，包含了常用的组件，如表格、表单、弹窗、下拉框、日期选择器等，旨在解放管理后台端 CRUD 页面的前端生产力，大大提高开发效率。

- [贡献指南](./CONTRIBUTING.md)
- [官方文档](https://wakeadmin.wakedata.com/components-doc/index.html)
- [如何使用](#如何使用)

## 主要特性

- 兼容 Vue 2 / 3
- 兼容 Element UI / Plus
- 加速管理后台端增删改查的页面开发, 使用声明式的方式配置页面

<br>
<br>

## 如何使用

### 安装

```shell
$ pnpm add @wakeadmin/components

```

如果你使用的是`Vue-Cli`，建议在 `vue.config.js` 中加入以下配置:

```js
// ...
module.exports = defineConfig({
  // 构建时转换 @wakeadmin/* 相关库，让 babel 参与转译，以符合你的兼容性需求
  transpileDependencies: process.env.NODE_ENV === 'production' ? [/(wakeapp|wakeadmin)/] : false,
  // ...
});
```

<br>

### 初始化

引入样式，并安装 Vue 插件:

```js
import Vue from 'vue';
import { plugin } from '@wakeadmin/components';

// 引入样式
import '@wakeadmin/components/style/index.scss';

// vue 2.x 用法
Vue.use(plugin);
```

<br>

### demo

开发一个简单的表格

```ts
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

<br>
<br>

## License

[MIT](./LICENSE)
