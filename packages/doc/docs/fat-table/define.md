# defineFatTable 定义器

<br>

::: tip

defineFatTable 基本使用已经在 [FatTable](./index.md) 中详细描述。

:::

<br>
<br>

我们推荐使用 `defineFatTable` + `TSX` 来快速定义一个表格组件，使用 defineFatTable 可以获取到更好的智能提示和类型检查。

<br>
<br>
<br>

`defineFatTable` 大致用法如下：

```tsx
interface T {
  // 列表项类型声明
}

interface Q {
  // 表单查询类型声明
}

export const MyTable = defineFatTable<T, Q>(({ table, column }) => {
  // 和 vue 的 setup 方法一样, 这里可以放置 Vue Composition API
  const someRef = ref(0);
  const someMethod = () => {};

  // 返回 FatTable props
  return () => ({
    // 列表请求
    async request(params) {
      // ...
    },
    // 列定义
    columns: [
      // ...
    ],
    // ... 其他 FatTable props
  });
});
```

defineFatTable 类似于 Vue 的 [defineComponent](https://vuejs.org/api/general.html#definecomponent), 支持放置 Vue Hooks，只不过要求返回的是 FatTable 的 props 定义。

<br>
<br>
<br>
<br>

### 参数

```
defineFatTable<Item, Query, Extra>(define: (context, options) => () => FatTableProps): VueComponent
```

泛型变量：

- `Item` 表格记录的类型
- `Query` 查询表单的类型
- `Extra` 自定义 props 定义，外部可以通过 extra 传入自定义参数

<br>
<br>
<br>

`context` 包含以下成员

- `table: Ref<FatTableMethods>` FatTable 实例引用
- `column` column 构造方法
- `props` 外部传入的 props。这是 `FatTableProps` 类型的。我们也可以通过 `props.extra` 访问扩展的自定义参数(见下文)
- `emit` 事件触发

<br>
<br>
<br>
<br>

### 返回

defineFatTable 最终返回一个 Vue 组件，可以像 FatTable 一样使用它：

```tsx
const NyTable = defineFatTable(/*...*/);

<MyTable
  // 可以传入任何 FatTable 的 props、事件、插槽。就跟使用 FatTable 本身一样
  title="可以覆盖 defineFatTable 的 props, 即优先级高于 defineFatTable 内部定义的 prop"
  // 扩展参数，defineFatTable 内部可以通过 props.extra 访问到
  extra={{ id: 'custom ' }}
/>;
```
