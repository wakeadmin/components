<script setup>
  import BaseDrag from './demo/drag.vue'
  import DragHandler from './demo/dragHandler.vue'
  import DragLimit from './demo/dragLimit.vue'
  import DragDisabled from './demo/dragDisabled.vue'
  import DragDelay from './demo/dragDelay.vue'
  import DropList from './demo/dropList.vue'
  import DropListHorizontal from './demo/dropListHorizontal.vue'
  import DropListPreview from './demo/dropListPreview.vue'
  import DropListPlaceholder from './demo/dropListPlaceholder.vue'
  import DropListConnectTo from './demo/dropListConnectTo.vue'
  import DropListGroup from './demo/dropListGroup.vue'
  import DropListGroupEnterPredicate from './demo/dropListGroupEnterPredicate.vue'

</script>

# Fat Drag Drop

`FatDragDrop` 用于处理拖拽操作。

<br>

[[toc]]

<br>
<br>
<br>

## 1. 创建一个自定义拖拽元素

<br>
<br>

<ClientOnly>
  <div class="wk-demo"><BaseDrag /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/drag.vue

:::

<br>
<br>
<br>

## 2. 自定义触发元素

默认情况下，整个元素都是可以响应拖拽事件的，我们也支持通过特定元素来进行触发拖拽，比如我们只允许通过点击`🐇`触发拖拽

<ClientOnly>
  <div class="wk-demo"><DragHandler /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dragHandler.vue

:::

<br>
<br>
<br>

## 3. 限制拖拽范围

默认情况下，我们不会对拖拽元素进行任何限制。但是我们也提供一些`props`用来限制元素的移动

<ClientOnly>
  <div class="wk-demo"><DragLimit /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dragLimit.vue

:::

::: tip
`drag-boundary` 如果传入一个`string`的话，那么会调用`document.querySelector`去获取对应的元素，请确保该元素已经被添加到页面上。
当然，我们也可以直接传入一个`HTMLElement`元素给它
:::

<br>
<br>
<br>

## 4. 禁用拖拽

通过`disabled`来禁用拖拽

<ClientOnly>
  <div class="wk-demo"><DragDisabled /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dragDisabled.vue

:::

<br>
<br>
<br>

## 5. 拖拽延迟

在一些特殊场合，我们的宿主元素可能需要同时监听`click`事件，这个时候我们可以添加拖拽延迟来防止元素错误的响应拖拽事件。比如下面的例子，我们需要等待鼠标按下**500ms**不动才会响应拖拽事件

<ClientOnly>
  <div class="wk-demo"><DragDelay /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dragDelay.vue

:::

<br>
<br>
<br>

## 6. 列表排序

<ClientOnly>
  <div class="wk-demo"><DropList /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropList.vue

:::

::: tip
`FatDropList` 也可以通过`disabled`来进行禁止拖拽
我们也可以针对`FatDragItem`的`disabled`来禁止单个元素的拖拽行为
:::

::: warning
`FatDropList` 不会修改任何数据，因此，使用者需要监听对应的事件来修改对应的数据源;
我们也提供了`moveItemInRefArray`、`transferArrayItem`这两个方法来方便使用者对数据源进行修改
:::

<br>
<br>
<br>

## 7. 水平列表排序

<ClientOnly>
  <div class="wk-demo"><DropListHorizontal /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListHorizontal.vue

:::

<br>
<br>
<br>

## 8. 自定义预览

默认情况下，我们会针对原元素进行一次复制，然后将其作为预览元素使用。用户也可以传入对应的渲染函数或者插槽来自定义预览;
<ClientOnly>

  <div class="wk-demo"><DropListPreview /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListPreview.vue

:::

::: tip
`FatDropList` 和`FatDragItem`都支持`preview`和`placeholder`插槽;
优先级为`FatDragItem` > `FatDropList`;
:::

::: danger
`preview`和`placeholder`插槽使用的数据源为当前响应拖拽事件的`FatDragItem`上的`props`的`data`属性;
:::

<br>
<br>
<br>

## 9. 自定义占位

<ClientOnly>
  <div class="wk-demo"><DropListPlaceholder /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListPlaceholder.vue

:::

::: warning
默认情况下，我们会在拖拽行为开始之前缓存当前宿主元素的位置信息，并且只允许鼠标在该宿主元素附近时才会执行排序操作。
在这里，因为我们使用了自定义占位图，从而导致宿主元素的高度进行了变化，因此我们需要加大其判断阈值（`drop-sort-threshold`）从而使得排序操作可以正确进行响应
:::

## 10. 不同列表直接的数据拖拽

<ClientOnly>
  <div class="wk-demo"><DropListConnectTo /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListConnectTo.vue

:::

::: tip
默认情况下，只允许指定的`FatDropList`的数据进入。上面的例子中，我们只允许右边的内容进入左边，但是左边的无法进入右边
:::

当然， 我们也提供`FatDropListGroup`组件来允许`FatDropList`直接的数据交互

<ClientOnly>
  <div class="wk-demo"><DropListGroup /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListGroup.vue

:::

::: tip
两者可以一起使用
:::

::: danger
无论是`connectTo`还是`FatDropListGroup`，该模式下`FatDropList`的`props.data`请务必跟`v-for`的数据源保持一致
:::

<br>
<br>
<br>

## 11. 不同列表直接的数据拖拽进入判断

在某些情况下，我们可能需要对进入的数据进行判断，看是否符合要求。
可以传入一个函数来进行处理。
比如下面的例子中，我们只允许**町、時の流れ、人**在两者之间进行数据传递

<ClientOnly>
  <div class="wk-demo"><DropListGroupEnterPredicate /></div>
</ClientOnly>

::: details 查看代码

<<< @/fat-drag-drop/demo/dropListGroupEnterPredicate.vue

:::

## 12. API

### 12.1 FatDragItem 属性

![](./images/fat-drag-item-props.png)

<br>
<br>
<br>
<br>

### 12.2 FatDragItem 事件

![](./images/fat-drag-item-events.png)

<br>
<br>
<br>
<br>

### 12.3 FatDragItem 实例方法

- `reset: () => void ` 重置拖拽状态

<br>
<br>
<br>
<br>

### 12.4 FatDragItem 插槽

- `preview` 自定义拖拽预览
- `placeholder` 自定义拖拽占位

<br>
<br>
<br>
<br>

### 12.5 FatDropList 属性

![](./images/fat-drop-list-props.png)

<br>
<br>
<br>
<br>

### 12.6 FatDropList 事件

![](./images/fat-drop-list-events.png)

<br>
<br>
<br>
<br>

### 12.7 FatDropList 实例方法

- `instance: DropListRef` DropListRef 实例

<br>
<br>
<br>
<br>

### 12.8 FatDropList 插槽

- `preview` 自定义拖拽预览
- `placeholder` 自定义拖拽占位

<br>
<br>
<br>
<br>

### 12.9 FatDragHandler 属性

- `disabled?: boolean` 是否禁止拖拽
- `tag?: string` 宿主元素 tag 默认为 span

<br>
<br>
<br>
<br>
