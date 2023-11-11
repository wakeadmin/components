# 常见问题

## 1. 如何将多个字段传入原件?

比如我需要在一个表格列中展示头像加上姓名.

解决办法有两种:

- FatTable 完全支持自定义单元格的渲染
- 通过 getter 方法组装传递给原件的属性

<br>
<br>
<br>

我们详细来看下:

**1. 自定义单元格渲染**

<iframe class="demo-frame" style="height: 800px" src="./custom-cell.demo.html" />

::: details 查看代码

<<< @/fat-table/CustomCell.tsx

:::

<br>
<br>
<br>

**2. 使用 getter 组装数据传入原件**

::: tip

原件是严格遵循 `value/onChange` 协议, 也就是说，它就是一个原子的表单，类似 Input。你无法给他传递多个字段。

:::

为此，FatTable 也提供了 getter/setter props 来满足这种使用场景。

<br>

<iframe class="demo-frame" style="height: 800px" src="./merge-fields.demo.html" />

::: details 查看代码

<<< @/fat-table/MergeFields.tsx

:::

<br>
<br>
<br>
<br>

## 2. 如何在表格实现开关切换的需求？

<iframe class="demo-frame" style="height: 800px" src="./switch.demo.html" />

::: details 查看代码

<<< @/fat-table/Switch.tsx

:::

<br>
<br>
<br>
<br>
<br>

## 3. 如何控制表格的单元格换行

<iframe class="demo-frame" style="height: 800px" src="./cell-line-control.demo.html" />

::: details 查看代码

<<< @/fat-table/CellLineControl.tsx

:::

<br>
<br>
<br>
<br>
<br>

## 4. 如何自定义表格渲染

<iframe class="demo-frame" style="height: 800px" src="./custom-table.demo.html" />

::: details 查看代码

<<< @/fat-table/CustomTable.tsx

:::
