# 支持 Typescript 和 JSX

**在 Vue 中开启 Typescript 和 JSX 支持并不是一件容易的事情**。 因此我们单独出一份文档来说明一下。

[[toc]]

<br>
<br>
<br>

## 依赖

如果你想要使用 `TSX`/`JSX` 开发，并且获取到更好的 `Typescript` 类型检查，需要安装以下依赖:

```shell
$ pnpm add babel-preset-wakeadmin @wakeadmin/h @wakeadmin/demi vue-tsc -D

# 升级 @wakeadmin/* 相关依赖到最新版本
$ pnpm up -r -L \"@wakeadmin/*\"
```

<br>
<br>

- `babel-preset-wakeadmin` 使用 [react jsx](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#react-automatic-runtime) 的标准语法来转换 JSX。
- `@wakeadmin/h` 更好地支持 react-jsx 的标准 JSX 语法，没有语法糖，更接近 React 的开发体验。兼容 Vue 2/3。详见[下文](#更好地支持-jsxtsx)
- `@wakeadmin/demi` fork from `vue-demi`, 修复了一些问题。可以完全取代 `vue-demi`
- [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc) Volar 底层依赖的 Typescript 编译器。这里主要用于类型检查

<br>
<br>

::: warning 建议将 @wakeadmin/\* 相关库都升级到最新版本
:::

<br>
<br>
<br>
<br>

## 构建

首先根据你使用的构建工具，配置相关的 Typescript 构建支持：

- `Vue CLI`: 安装 [`@vue/cli-plugin-typescript`](https://cli.vuejs.org/core-plugins/typescript.html)
- `Vite`: [内置支持转换](https://vitejs.dev/guide/features.html#typescript), 但是类型检查需要借助 vue-tsc

<br>
<br>

::: danger 💥 **如果使用了 `@vue/cli-plugin-typescript` 插件，请关闭掉 [`fork-ts-checker-webpack-plugin`](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/tree/6.5.x)**:

编辑 `package.json`:

```json
{
  "fork-ts-checker": {
    "typescript": false
  }
}
```

<br>
<br>

为什么不使用它？ [**Vue 官方也不推荐使用它**](https://vuejs.org/guide/typescript/overview.html#note-on-vue-cli-and-ts-loader)。一个比较重要的问题是，它的执行结果未必和 IDE 一致，异常也很难排查。性能也较差、无法同 vue-tsc 一样真正检查 `*.vue` 文件。

:::

<br>
<br>
<br>
<br>

## 配置

接着配置 tsconfig.json:

```json
{
  "compilerOptions": {
    "types": ["@wakeadmin/demi"]
  },
  // 如果是 vue 2, 则加上以下配置
  "vueCompilerOptions": {
    "target": 2.7
  }
}
```

<br>
<br>
<br>

接着，配置一个 `src/env.d.ts`(旧的项目可能已存在, 比如 vue-cli, `shims-tsx.d.ts`、`shims-vue.d.ts`, 将这些文件删掉) 文件，让 TypeScript **标准**的类型检查器可以识别 `*.vue` 文件:

```ts
// env.d.ts
// 你可能把旧的 declare module '*.vue' 移除
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

::: tip _`.vue` 文件, 像 `.css` 这些静态资源文件一样, 标准的 Typescript 是无法识别里面的类型的_, 当然装了 Volar 插件之后, Valor 可以做到。但是仅在 IDE 层面，如果你想要在构建时/CI 时进行类型检查，可以用 [vue-tsc](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc)
:::

<br>

<br>
<br>
<br>

## IDE 类型提示

**IDE** 上推荐使用 [`Valor`](https://github.com/johnsoncodehk/volar) 插件，并**禁用掉 `Vetur` 插件**。在 VSCode 中, 你可以安装一下两个插件:

<br>

- [Vue Language Features](https://marketplace.visualstudio.com/items?itemName=Vue.volar): Vue, Vitepress, petite-vue language support extension for VSCode
- [TypeScript Vue Plugin ](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) VSCode extension to support Vue in TS server

<br>
<br>
<br>
<br>

## 开启类型检查

最后，如果想要对类型进行检查，推荐使用 [`vue-tsc`](https://github.com/johnsoncodehk/volar/tree/master/vue-language-tools/vue-tsc):

```json
// package.json
{
  "scripts": {
    "prebuild": "vue-tsc --noEmit"
  }
}
```

如果使用了惟客云[自动化检查工具](https://wakedata.notion.site/d223981cad664edab0c89fd269aa751d), 可以这样配置：

```json
// .standard.jsonc
{
  // 执行 Typescript 类型检查
  "typescriptEnable": true,

  // typescript 检查命令
  "typescriptCmd": "vue-tsc --noEmit"
}
```

<br>
<br>
<br>
<br>

## 更好地支持 JSX/TSX

<br>

大部分场景，我们推荐你使用 Vue 的 [SFC](https://vuejs.org/guide/scaling-up/sfc.html) + [setup + TypeScript](https://vuejs.org/guide/typescript/composition-api.html#typing-component-props) 来编写组件。

<br>

然而，在你们使用 `@wakeadmin/components` 时，为了灵活定义组件库，你会经常用到 JSX。

<br>

假设你的项目使用是 Vue-cli, 第一步先修改 `babel.config.js`

```js
module.exports = {
  // 关闭 vue 默认的 jsx 转换， 统一使用标准的 JSX
  presets: [['@vue/cli-plugin-babel/preset', { jsx: false }], 'babel-preset-wakeadmin'],
};
```

<br>
<br>

接着修改 `tsconfig.json` 配置:

```json{3,4}
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "@wakeadmin/h",
    "types": ["@wakeadmin/demi"],
  },
}

```

<br>
<br>
<br>

这里，我们使用 [`@wakeadmin/h`](https://wakeadmin.wakedata.com/base/h.html) 来编写 JSX。好处是：

<br>

1. **不管你用的是 Vue 2, 还是 Vue 3, 使用 `@wakeadmin/h` 可以提供一致的编写方式**, 更接近我们在 React 上的使用习惯。

   - Vue 2 / 3 JSX 书写上[相差非常大](https://www.notion.so/Vue-2-3-302cbe0e37794345bbfbd89e32d617db)
   - Vue 官方的 JSX 库携带了很多语法糖。这依赖于 Babel 的转换，这意味着你无法直接使用 esbuild、Typescript 这类工具进行编译。

2. 除此之外，`@wakeadmin/h` 也优化了 Vue JSX 在 Typescript 支持上的一些问题。

<br>
<br>

使用示例：

```jsx
<div onClick={handleClick} class="hello" />; // 使用 on* 的语法进行事件监听
<div onClick={handleClick} class={[hello, { active: isActive }]} style={{ color: 'red' }} />;

// 插槽的使用，使用 v-slots
<Tooltip v-slots={{ content: <div>hello</div>, named: scope => <div>命名插槽</div> }}>
  <span class="fat-actions__btn">{content}</span>
</Tooltip>;

// 指令：https://vuejs.org/api/render-function.html#withdirectives
<div {...withDirectives([[vLoading, loading.value]])}>加载中</div>;
```

<br>
<br>
<br>
<br>

## ESLint 适配

<br>

你可以使用 `wkstd init` 来初始化 eslint 的配置, 典型的 ESlint 配置如下：

```js
module.exports = {
  extends: ['wkts', 'wkvue'],
  plugins: [],
  globals: {},
  rules: {
    'vue/no-deprecated-slot-attribute': 'off',
  },
  parser: 'vue-eslint-parser',
  // 为了支持 Typescript 需要配置 '@typescript-eslint/parser'
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
  // 检查 .tsx/.ts 文件
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // 使用 typescript 检查
      },
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

然而可能不会像你想象的那么顺利。

::: danger ❌ 异常 1: Parsing error: "parserOptions.project" has been set for @typescript-eslint/parser. The file does not match your project config: packages/eslint-config-wkvue/**tests**/vue2/ts/.eslintrc.js. The file must be included in at least one of the projects provided

<br>

**原因分析**： 我们在上面的 eslint 配置中指定了 `@typescript-eslint/parser` 作为所有文件 parser。然而 `@typescript-eslint/parser`, 如果指定的文件不再 tsconfig.json 的覆盖范围之内就会出现该问题。

<br>
<br>

解决办法：

- ① (不推荐)在 tsconfig.json include 进来, 比如:

  ```json
  // tsconfig.json
  {
    "include": [
      "types.d.ts",
      "src/**/*.vue",
      "scripts",
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.js",
      "tailwind.config.js",
      ".eslintrc.js",
      "vue.config.js"
    ],
    "exclude": ["node_modules"]
  }
  ```

  <br>

  对于旧的项目，这些文件很多。这种解法比较蠢，而且会影响 Typescript 的检查效率，甚至会污染检查的结果。如果真的非得用这种方式，可以另起一个 `tsconfig.eslint.json` 的配置文件，并将 `parserOptions.project` 指向这个文件。

  <br>
  <br>
  <br>

- ② 为不同的文件支持不同的 parser

  `tsconfig.json` 应该专注于应该检查的文件：

  ```json
  {
    "compilerOptions": {
      // 支持引用 js 模块
      "allowJS": true,

      // 对于旧项目不建议打开, 会有很多报错
      "checkJS": false
    },
    // 检查 .vue 文件
    "include": ["src/**/*", "src/**/*.vue"]
  }
  ```

  <br>

  接着配置 eslintrc [对不同的文件使用不同的 parser](https://github.com/vuejs/vue-eslint-parser#parseroptionsparser) 进行处理：

  ```js
  module.exports = {
    extends: ['wkts', 'wkvue'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: {
        js: '@babel/eslint-parser',
        jsx: '@babel/eslint-parser',
        ts: '@typescript-eslint/parser',
        tsx: '@typescript-eslint/parser',
      },
      project: './tsconfig.json',
      sourceType: 'module',
      extraFileExtensions: ['.vue'],
    },
  };
  ```

  <br>
  <br>

- ③ (推荐) 一个更简单的办法是开启 typescript-eslint 的 `createDefaultProgram` 选项：

  ```js{8}
  module.exports = {
    extends: ['wkts', 'wkvue'],
    parser: 'vue-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser',
      project: './tsconfig.json',
      sourceType: 'module',
      createDefaultProgram: true,
      extraFileExtensions: ['.vue'],
    },
  };
  ```

  简单的代价是性能会稍差一些。

<br>
<br>

:::

<br>
<br>
<br>

::: danger ❌ 异常 2: 如果你要在 Vue SPA 中使用 `<script lang="tsx"></script>`， Eslint 可能会报错，你需要以下配置：

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
  extends: ['wkts', 'wkvue'],
  // ....  eslint 配置
};
```

:::

<br>
<br>
<br>
<br>

## 老项目中启用 TypeScript

老项目(假设是 Vue 2)中也可以按照上文的配置开启 Typescript。有以下几个要点

- 开启 `tsconfig.json` 的 allowJS, 而不是 checkJS。这表示允许和 Javascript 混用，但不检查 Javascript。如果开启 checkJS 可能有成吨的异常抛出来。
- 如何扩展 Vue 的类型？比如全局方法、全局对象、全局组件等等。 Vue 2/3 定义方式有点区别，**这里展示 Vue 2 的使用方式**，你也可以参考相关的第三方库。以 vue-router 为例

  扩展全局组件实例成员:

  ```typescript
  declare module 'vue/types/vue' {
    interface Vue {
      $router: VueRouter;
      $route: Route;
    }
  }
  ```

  扩展 optional API

  ```ts
  declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
      router?: VueRouter;
      beforeRouteEnter?: NavigationGuard<V>;
      beforeRouteLeave?: NavigationGuard<V>;
      beforeRouteUpdate?: NavigationGuard<V>;
    }
  }
  ```

  扩展全局组件:

  ```ts
  declare module 'vue' {
    export interface GlobalComponents {
      RouterLink: typeof import('vue-router')['RouterLink'];
      RouterView: typeof import('vue-router')['RouterView'];
    }
  }
  ```
