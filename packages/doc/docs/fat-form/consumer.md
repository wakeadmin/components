# FatFormConsumer 表单内省

用于获取 FatForm 的内部状态。可以实现精确渲染.

使用方法见 [FatForm 表单](./index.md)

<br>
<br>
<br>

## API

```ts
export interface FatFormConsumerProps<S extends {} = {}> {
  /**
   * 也可以通过 #default slot
   */
  renderDefault?: (form: FatFormMethods<S>) => any;
}
```

<br>
<br>
<br>
