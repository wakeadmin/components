# FatFormPage 表单页面

`FatFormPage` 是 FatForm 针对页面场景设计的一个组件。用于快速创建一个表单创建、编辑、预览页面。

<br>
<br>

# 示例

通过 FatFormPage 可以快速创建表单相关的预览、编辑、新建页面。

<br>

**新建页面**

<iframe class="demo-frame" style="height: 400px" src="./page.demo.html" />

<br>
<br>

**编辑页面**

<iframe class="demo-frame" style="height: 400px" src="./page.demo.html?id=xxx" />

<br>
<br>

**详情页面**

<iframe class="demo-frame" style="height: 280px" src="./page.demo.html?id=xxx&type=detail" />

<br>

::: details 查看代码

<<< @/fat-form-layout/Page.tsx

:::

<br>
<br>
<br>
<br>

## 自定义布局

`FatFormPage` 默认使用的是惟客云的页面布局，我们也支持自定义布局。

布局协议如下:

<br>
<br>

```tsx
// 返回 JSX Node
export type FatFormPageLayout = (renders: {
  class?: ClassValue;
  style?: StyleValue;

  form?: Ref<FatFormMethods<any> | undefined>;

  /**
   * 渲染标题
   */
  renderTitle: () => any;

  /**
   * 渲染额外内容
   */
  renderExtra: () => any;

  /**
   * 渲染表单主体
   */
  renderForm: () => any;

  /**
   * 渲染提交按钮, 禁用时为空
   */
  renderSubmitter?: () => any;

  /**
   * 布局自定义参数
   */
  layoutProps: any;
}) => any;
```

<br>

默认实现：

```tsx
const DefaultLayout: FatFormPageLayout = ctx => {
  return (
    <div class={normalizeClassName('fat-form-page', ctx.class)} style={ctx.style}>
      <FatContainer
        {...ctx.layoutProps}
        v-slots={{
          title: ctx.renderTitle(),
          extra: ctx.renderExtra(),
        }}
      >
        {ctx.renderForm()}
      </FatContainer>
      {!!ctx.renderSubmitter && <FatFloatFooter>{ctx.renderSubmitter()}</FatFloatFooter>}
    </div>
  );
};
```

<br>
<br>

::: tip

也可以通过 `FatConfigurableProvider` 全局配置

:::

<br>
<br>
<br>

## API

<br>
<br>
<br>

![](./images/fat-form-page.png)

<br>
