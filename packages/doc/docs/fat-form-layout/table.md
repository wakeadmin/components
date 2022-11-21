# FatFormTable 表格表单

`FatFormTable` 以表格的形式来展现数组表单。

## 示例

<iframe class="demo-frame" style="height: 500px" src="./table.demo.html" />

::: details 查看代码

<<< @/fat-form-layout/Table.tsx

:::

::: warning element-ui 先建议显式设置 table 的宽度，避免溢出
:::

::: warning 表单验证规则建议设置在 tableColumn 上，而不是 table 或者 form 上。因为数组项的 prop 是动态的
:::

<br>
<br>
<br>
<br>

自定义创建表单项:

<iframe class="demo-frame" style="height: 500px" src="./table-custom-create.demo.html" />

::: details 查看代码

<<< @/fat-form-layout/TableCustomCreate.tsx

:::

<br>
<br>
<br>
<br>

## API

![](./images/fat-form-table.png)
