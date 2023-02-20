## 实现

基本上参考 `@angular/cdk` 的`drag-drop`的流程

- `fat-drag-handler`

~~针对拖拽响应元素 这里采用指令的方式进行处理~~

~~如果使用组件的模式 会额外进行一层对应的包装 完全没有任何意义~~

垃圾 Vue

指令模式无法获取其拖拽上下文

通过组件进行封装

- `fat-drag-placeholder` 以及 `fat-drag-preview`

这两个采用`slot`模式是为了方便固定其上下文以及行为统一

一开始设计上是直接通过组件内部状态进行控制, ~~但是考虑到指令的实现模式~~，最终决定统一实现模式。在内部会通过`Portal`进行`slot`或者是`render`的实例挂载;