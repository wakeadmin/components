# 初始化

`@wakeadmin/components` 是基于 Vue 和 `Element-UI`/`Element-plus` 的高级组件库。旨在解放管理后台端 CRUD 页面的前端生产力。

<br>
<br>
<br>

## Prerequisites

`@wakeadmin/components` 支持 Vue 2/3:

- **Vue 2**: 要求 Vue 2.7+, element-ui 2.14+
- **Vue 3**: Vue 3.0+, element-plus 2.2+

<br>
<br>

## 安装

```shell
$ pnpm add @wakeadmin/components
```

<br>
<br>

**开发依赖**:

如果你想要使用 TSX/JSX 开发，并且获取到更好的 Typescript 类型检查，需要安装一下依赖:

<br>

```shell
$ pnpm add babel-preset-wakeadmin @wakeadmin/h @wakeadmin/demi @vue/runtime-dom -D
```

::: tip

推荐使用 Valor 插件，并禁用掉 Vetur 插件

:::

<br>
<br>
<br>

## JSX 支持

假设你的项目使用 Vue-CLI:

修改 `babel.config.js`

```js
module.exports = {
  // 关闭 vue 默认的 jsx 转换， 统一使用标准的 JSX
  presets: [['@vue/cli-plugin-babel/preset', { jsx: false }], 'babel-preset-wakeadmin'],
};
```

Typescript 配置:

```json{3,4,5}
{
  "compilerOptions": {
    "jsx": "preserve" /* Specify JSX code generation: 'preserve', 'react-native', 'react', 'react-jsx' or 'react-jsxdev'. */,
    "jsxImportSource": "@wakeadmin/h",
    "types": ["@wakeadmin/demi"]
  },
}

```

<br>
<br>

如果你要在 Vue SPA 中使用 TS + JSX， Eslint 可能会报错，你需要以下配置：

```js{4-10}
// 支持 .vue 文件中 包含 jsx
const ts = require('typescript');

const { ensureScriptKind } = ts;
ts.ensureScriptKind = function (fileName, ...args) {
  if (fileName.endsWith('.vue')) {
    return ts.ScriptKind.TSX;
  }
  return ensureScriptKind.call(this, fileName, ...args);
};

module.exports = {
  extends: ['wkts', 'wkvue', 'plugin:jest/recommended'],
  plugins: [],
  globals: {},
  rules: {},
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 'latest',
    extraFileExtensions: ['.vue'],
  },
  env: {
    browser: true,
    es2020: true,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {},
      parser: '@typescript-eslint/parser',
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: true,
        ecmaVersion: 'latest',
        lib: ['esNext'],
        project: './tsconfig.json',
      },
    },
  ],
};
```

<br>
<br>
<br>

## 开启编程之旅

最后安装 Vue 插件:

```tsx
import Vue from 'vue';
import { plugin } from '@wakeadmin/components';

// vue 2.x 用法
Vue.use(plugin);
```

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
