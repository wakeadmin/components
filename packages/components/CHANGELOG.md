# @wakeadmin/components

## 1.9.2

### Patch Changes

- feat: 暴露 useFatFormInheritableProps Hooks

## 1.9.1

### Patch Changes

- fix: 修复 fat-logic-tree 没有向下穿的 nodeClass

## 1.9.0

### Minor Changes

- 新增 time-select 原件

### Patch Changes

- Updated dependencies
  - @wakeadmin/element-adapter@0.6.10

## 1.8.25

### Patch Changes

- - feat: fat-logic-tree 扩展 nodeClass、nodeStyle、groupClass、groupStyle 属性
  - feat: fat-import 支持多语言
  - feat: fat-form-section 支持 disabled 选项
  - feat: fat-table-select-modal，新增 confirm 事件
  - fix: 修复 fat-table-select-modal onChange 会触发两次

## 1.8.24

### Patch Changes

- - feat: fat-table 新增 requestOnExtraQueryChange, 独立监听 extraQuery 的变化
  - feat: fat-i18n-content 支持关闭本地缓存
  - fix: 缩短 useLazyFalsy 的等待时间，降低重用的概率

## 1.8.23

### Patch Changes

- fix: 内容多语言批量保存时支持缓存，修复组件切换销毁后状态丢失

## 1.8.22

### Patch Changes

- fix: 修复内容多语言在 blur 事件触发时报错，待保存项过滤掉值为空的情况

## 1.8.21

### Patch Changes

- 重构 providerI18nContentOptions 为 providerI18nContentOptions, 新增 useI18nContent

## 1.8.20

### Patch Changes

- fix: 修复 fat-form-group required 没有设置 prop 不生效

## 1.8.19

### Patch Changes

- fix: fat-form submit 向上抛出错误

## 1.8.18

### Patch Changes

- fix: 修复 fat-table column 变化没有触发 actions 渲染

## 1.8.17

### Patch Changes

- fix: 修复 mergeProps 会转换非 kebab-case

## 1.8.16

### Patch Changes

- fix: fat-table、fat-form 支持关闭 hmr

## 1.8.15

### Patch Changes

- - 修复 images tip 渲染问题
  - 修复内容多语言正则匹配问题

## 1.8.14

### Patch Changes

- 引入实验性的内容多语言组件
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.9

## 1.8.13

### Patch Changes

- 修复在 vue 2 下多语言导致死循环

## 1.8.12

### Patch Changes

- - 验证规则 trigger 支持传入数组
  - atomic 上下文新增 required
  - 暴露 useFormItemValidate 用于自定义表单场景
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.8

## 1.8.11

### Patch Changes

- - fat-table 新增 columnWidth
  - fat-logic-tree 多语言支持

## 1.8.10

### Patch Changes

- - fat-form-item、fat-form-group message 支持设置宽度

## 1.8.9

### Patch Changes

- - fat-table-select 支持 actionColumnProps 的定制操作栏样式
  - fat-table 新增 columnMinWidth 支持动态配置所有列的 minWidth

## 1.8.8

### Patch Changes

- 修复多语言翻译问题

## 1.8.7

### Patch Changes

- fix: 优化 fat-form 热更新，路由切换后销毁缓存状态

## 1.8.6

### Patch Changes

- 支持和 unplugin-wakeadmin-components 配置实现热更新

## 1.8.5

### Patch Changes

- 修复 fat-form-modal/drawer 通过 open 方法传入的 onFinish 没有被调用
- 修复 element-plus 时间选择起 clear 跳动问题
- fat-form 支持 extraValue 参数

## 1.8.4

### Patch Changes

- 修复: fat-form-\* renderButton 在 preview 模式隐藏提交和重置按钮

## 1.8.3

### Patch Changes

- 新功能

  - define\* 方法新增 p 方法, 用于需要类型检查 prop 定义

  修复

  - fat-form-group 在 preview 模式不应该显示必填星号
  - 修复日期相关的原件在指定 valueFormat 情况下, 可能日期可能会解析失败

## 1.8.2

### Patch Changes

- 功能修复:

  - 修复 fat-table 卸载后没有清理 debounce
  - 修复 FatForm\* 相关 ref 类型可能为空

## 1.8.1

### Patch Changes

- 实验性组件:

  - 新增 FatImageVerification 图形验证码组件

  修复:
  修复一些多语言翻译错误

## 1.8.0 (2023/7/7)

### Minor Changes

新增功能:

- fat-form-item 新增 valueMap 属性, 可以对原件的值进行输入输出转换
- 新增 number 原件
- 暴露了 fat-table, fat-form-page 的默认布局实现, 供开发者进行组合

bug 修复

- undefinedPlaceholder 不限制类型, 支持传入 vnode, 实现复杂的样式展示
- 修复 useRoute 在 vue 2 下报错

## 1.7.37

### Patch Changes

- 修复 fat-form-table 下 fat-actions 类没有生效

## 1.7.36

### Patch Changes

- 优化 fat-actions, fat-form-steps 样式

## 1.7.35

### Patch Changes

- 修复文本原件空状态没有考虑 0 false 等情况

## 1.7.34

### Patch Changes

- fat-form-item trim 支持 blur, 在失去焦点后截断空格

## 1.7.33

### Patch Changes

- fatTable 全局配置新增 actionsAlign 来支持全局配置表格的操作栏对齐方式

## 1.7.32

### Patch Changes

- 内置原值支持传入 undefinedPlaceholder, 覆盖全局配置
- 文本原件判断逻辑变更. 旧版本通过 != null, 现在改为 !value

## 1.7.31

### Patch Changes

- 修复: fat-form-page submiter slot 参数传递错误

## 1.7.30

### Patch Changes

功能优化:

- fat-form 新增 forceSetInitialValue 属性, 默认情况下为 false，即新的 initialValue 会和旧的合并
- fat-form-table 新增 enableActions 以支持对操作栏进行手动关闭
- fat-form-table, fat-table rowKey 支持 symbol

Bug 修复:

- fat-form-steps 预览模式下, 显示上一步和下一步

## 1.7.29

### Patch Changes

- update deps
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.7

## 1.7.28

### Patch Changes

- 修复: fat-table-select 关闭查询缓存

## 1.7.27

### Patch Changes

- - 修复: fat-atomic v-slots 导致崩溃

## 1.7.26

### Patch Changes

- - select 原件新增 selectFirstByDefault
  - 修复 fat-atomic 类型无法动态扩展

## 1.7.25

### Patch Changes

- - 优化: 表格 action 列默认居中
  - 修复: 导出 fat-space props
  - 新增: fat-form-item 支持 valueChange 事件

## 1.7.24

### Patch Changes

- 修复: fat-text tooltip 重复

## 1.7.23

### Patch Changes

- 功能优化:

  - fat-form-table 新增 removable 参数, 配置删除操作是否显示
  - fat-form-query 支持配置 labelWidth 来关闭 label 对齐模式

  修复:

  - 修复 useRoute 下 vue 3 下可能失效

## 1.7.22

### Patch Changes

- fat-form-table 支持自定义 table column props
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.6

## 1.7.21

### Patch Changes

- 修复 fat-text tooltip 展示问题

## 1.7.20

### Patch Changes

- 支持全局配置是否复用基座的组件
- fat-text 支持溢出时使用 tooltip 展示完整内容
- select, multi-select 支持 fat-text

## 1.7.19

### Patch Changes

- 修复原件多语言配置更新失败

## 1.7.18

### Patch Changes

- 修复 fat-configurable 多语言不生效

## 1.7.17

### Patch Changes

- - fix: 修复 fat-form-query 清除按钮抖动问题
  - fix: 组件库默认配置支持多语言

## 1.7.16

### Patch Changes

- 修复样式污染问题

## 1.7.15

### Patch Changes

- 修复部分原件预览没有设置 class 和 style

## 1.7.14

### Patch Changes

- - select 原件 clear 后将值设置为 undefined
  - fat-form submit 处理 abort 异常

## 1.7.13

### Patch Changes

- 修复 select 选项验证错误

## 1.7.12

### Patch Changes

- 原件支持动态注册验证器

## 1.7.11

### Patch Changes

- fat-logic-tree 插入操作支持批量

## 1.7.10

### Patch Changes

- 修复 fat-table-select 类型错误

## 1.7.9

### Patch Changes

- 优化 fat-table-select

## 1.7.8

### Patch Changes

- fat-table-modal, fat-table-select 优化

## 1.7.7

### Patch Changes

- fat-logic-tree 添加 indexs 上下文

## 1.7.6

### Patch Changes

- fat-table 列支持 columnMode
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.5

## 1.7.5

### Patch Changes

- 修复 fat-form-drawer/modal renderSubmitter 不生效

## 1.7.4

### Patch Changes

- - 修复 fat-form-step 隐藏问题
  - fat-form-table 新增 beforeRemove props. sortableProps.ignoreMode

## 1.7.3

### Patch Changes

- 修复空值合并错误

## 1.7.2

### Patch Changes

- 修复 merge 方法不支持 symbol

## 1.7.1

### Patch Changes

- 修复 fat-logic-tree 传入空值时异常

## 1.7.0

### Minor Changes

- 扩展 fat-form-step, fat-form-table props 以支持更多样式定制

## 1.6.0

### Minor Changes

- fat-form-table 支持自定义渲染

## 1.5.0

### Minor Changes

- 新增 fat-logic-tree

## 1.4.0

### Minor Changes

- fat-form-table 支持拖拽排序
- 修复 fat-form-steps 循环依赖问题

### Patch Changes

- Updated dependencies
  - @wakeadmin/element-adapter@0.6.4

## 1.3.0

### Minor Changes

- 新增国际化支持

## 1.2.4

### Patch Changes

- 修复上传文件时 filter 抛出异常导致文件缓存没有正常同步的问题

## 1.2.3

### Patch Changes

- 现在 avatar 原件允许自定义宽高
- 修复 Portal 在 attach 时会导致 vue 上下文异常的问题
  > 现在 `Portal.attach` 不再是同步行为，因此如果需要在`attach` 后立刻执行一些操作需要进行一些调整

```typescript
// before
portal.attach();
portal.show();

// after
portal.attach().then(() => portal.show());
```

## 1.2.2

### Patch Changes

- 修复 [ElementForm]unpected width
- Updated dependencies
  - @wakeadmin/element-adapter@0.6.2

## 1.2.1

### Patch Changes

- 修复 kebab-case 传参无法正常覆盖 lowerCamelCase 的问题

## 1.2.0

### Minor Changes

- FatFormItem、FatFormGroup 新增`requiredMessage` 支持
- FatFormItem、FatFormGroup 新增 `maxWidth` 、`minWidth`

#### Break Change

- 在之前的版本中, FatFormItem、FatFormGroup 的 `width` 会被设置成`maxWidth`, 现在`width` 就是 `width`。因此这次升级可能会对之前的布局造成一些影响

## 1.1.9

### Patch Changes

- 导出所有工具类函数

## 1.1.8

### Patch Changes

- 导出类型转换函数

## 1.1.7

### Patch Changes

- pref: 删除无用代码

## 1.1.6

### Patch Changes

- 修复 fatFrom 没有正确合并 initialValue 的问题

## 1.1.5

### Patch Changes

- feat: 调整 fatForm initialValue 的类型以及 initialValue 的合并模式

## 1.1.4

### Patch Changes

- fix:修复 fat-table 在删除数据之后分页可能异常的问题

## 1.1.3

### Patch Changes

- 修改 fat-table 空图片样式

## 1.1.2

### Patch Changes

- fat-table 空数据支持自定义图片

## 1.1.1

### Patch Changes

- 导入部分 typescript 类型

## 1.1.0

### Minor Changes

- 新增 fat-drag-drop 组件
- 新增 `DANGEROUS_Portal` API (实验性 API)

## 1.0.1 (2022/1/5)

功能更新

- 新增 fat-table-modal、fat-table-drawer、fat-table-select-modal、fat-table-select 等组件

<br>
<br>
<br>
<br>

## 1.0.0-beta.9 (2022/12/9)

功能更新

- fat-form-group 支持自定义验证时机

Bug 修复

- fat-form submitting 延迟关闭

<br>
<br>
<br>
<br>

## 1.0.0-beta.8 (2022/12/8)

Bug 修复

- defineFatTableModal/Drawer/SelectModal 方法支持 extra props
- FatActions 新增 dropdownProps
- 修复 FatTable\* 相关组件 expose 调用错误

<br>
<br>
<br>
<br>

## 1.0.0-beta.7 (2022/11/30)

新功能

- 新增 fat-text、fat-link 组件

<br>
<br>

Bug 修复

- 调整 fat-table remove props 类型，不需要返回 boolean
- 修复 select\* 相关原件 loading 状态不展示
- 文本相关原件支持透传 fat-text props

<br>
<br>
<br>

## 1.0.0-beta.6 (2022/11/29)

Bug 修复

- 修复 fat-form-modal/drawer 快速关闭和打开导致表单初始值错误
- 修复 fat-table 在关闭 requestOnMounted 时，无法启用 requestOnQueryChange
- 修复 fat-form-tabs、fat-form-steps 渲染延迟问题

<br>
<br>
<br>

## 1.0.0-beta.4 (2022/11/25)

主要功能更新

- 新增 FatTreeSelect 组件
- 新增 tree-select 原件
- FatFormModal、FatFormDrawer 支持配置 FatFormTabs、FatFormSteps 使用

<br>
<br>
<br>
<br>

## 1.0.0-beta.3 (2022/11/20)

主要功能更新

- 原件默认提示文案优化
- fat-table 新增 getRequestParams 实例方法
- 新增 fat-form-table，支持表单形式的数据项编辑
- 新增 fat-form-tabs 支持标签页表单
- fat-form-group 新增 spaceProps 参数
- fat-form-group 支持数据验证

<br>
<br>
<br>
<br>

## 1.0.0-beta.2 (2022/11/7)

功能修复

- 修复 fat-table 首次加载数据是 empty 组件闪烁
- 修复 fat-form-query 无法覆盖 renderSubmitter
- 暴露 fat-form, fat-table 状态到 Vue 开发者工具

<br>
<br>
<br>

## 1.0.0-beta.1 (2022/11/04)

主要功能更新

- 新增 FatVNode 用于支持在 template 中渲染 VNode
- fat-form-query, fat-table 表单提交按钮独占一行时，自动对齐

<br>
<br>

功能修复

- 修复 fat-table formRef 没有包含 renderButtons

<br>
<br>

欢迎给我们提[问题](http://gitlab.wakedata-inc.com/wakeadmin/components/-/issues)

<br>
<br>
<br>

## 1.0.0-alpha.7 (2022/10/26)

主要功能更新:

- checkboxs, radio 原件支持垂直布局
- 新增 FatFormSteps 分布表单

<br>
<br>

Bug 修复：

- 修复 fat-form validateField 在 element-ui 下没有返回 promise

<br>
<br>
<br>

## 1.0.0-alpha.6 (2022/10/21)

主要功能更新：

- fat-table、fat-form 相关组件支持泛型
- Typescript 类型优化

<br>

Bug 修复：

- FatActions Dropdown 禁止右键点击

<br>
<br>
<br>
<br>

## 1.0.0-alpha.5 (2022/10/20)

- checkboxs, checkbox, radio 原件 label 支持 jsx 和函数形式

<br>
<br>
<br>

## 1.0.0-alpha.4 (2022/10/18)

Bugs 修复：

- 修复构建结果依赖于 `@vue/reactivity` 导致类型检查失败
- FatContainer 不传递 title、extra 时支持隐藏 header
- 修复 FatTable 在批操作之后选中状态显示异常的问题

<br>
<br>
<br>

## 1.0.0-alpha.3 (2022/10/17)

### 主要更新

- 升级 @wakeadmin/demi, @wakeadmin/h。

  - 现在不再依赖于 `@vue/runtime-dom`, 直接使用 Vue 2/3 的类型。避免了 Vue 2/3 类型胡窜导致的问题
  - 依赖 Vue 2.7.13+, 请参照安装文档重新配置, 并将所有 @wakeadmin/\* 相关依赖升级到最新

- 新增 FatSwitch 组件。该组件从 element-plus 中移植，支持内联 label、loading、和 beforeChange 钩子。 switch 原件也跟随升级

- 对接新的惟客云 UI 变量。fat-form width 也跟随变化
- FatContainer 支持 legacyMode
- fat-table column 新增 setter、valueProps 支持函数形式
- avatar 原件支持 string 类型直接传入头像链接
- fat-form-item 新增 filter，可以在字段变更之前对 value 进行操作

<br>

### 功能优化

- fat-actions 边距使用 gap CSS 属性
- fat-table remove 实例方法现在返回 `Promise<boolean>` 表示是否移除成功

<br>
<br>
<br>
<br>

## 1.0.0-alpha.2 (2022/10/12)

**Breaking Change**

- FatHeader 移除，并使用 FatContainer 取代
- FatTable 移除 simple 布局
- FatFloatFooter 属性变更 useWakeadminHeaderIfNeed 修改为 reuseBayIfNeed

**新功能**

- 新增 avatar 原件
- image 原件支持 fit 属性配置
- [新 UI 规范适配](https://codesign.qq.com/s/QmlyZwl22kjWRA1/BGAE9Kyg3zNZlRd/inspect)
  - 新增 FatCard 卡片容器
  - FatFormSection 调整为卡片形式, **并废弃折叠功能**
  - **FatHeader 移除** , 使用 FatContainer 替代, **受影响组件主要有 FatTable, simple 布局移除**
  - FatContent 即将废弃，建议使用 FatCard 取代

<br>

**Bug 修复**

- `date*`/`time*` 相关原件对时间格式化字符串进行规范化，从而支持 element-ui 的语法

<br>
<br>
<br>
<br>

## 1.0.0-alpha.1 (2022/10/10)

🎉 第一个 alpha 版本

<br>
<br>

## 0.6.1 (2022/10/9)

### Patch Changes

- 原件 renderPreview 执行方式统一; 文件相关原件兼容 element-plus

## 0.6.0 (2022/10/8)

### Minor Changes

**新增原件：**

- email: 邮件
- phone: 手机号码输入
- files：多文件上传
- file: 单文件上传
- captcha: 验证码
- slider-range: 范围滑块

<br>

**新增组件**

- FatAtomic 支持独立使用原件

<br>

**功能优化**

- 优化组件类型检查
- fat-actions 使用 Tooltip 进行 title 展示

<br>

### Patch Changes

- Updated dependencies
  - @wakeadmin/element-adapter@0.2.4

## 0.5.7 (2022/10/30)

### Patch Changes

- Bug 修复

  - 避免原件重复注册
  - fat-form 样式优化

- API 调整

  - define\* 相关方法参数合并成 context 一个参数
  - fat-table 新增 after-submit submitter 两个插槽
  - fat-table query 参数调整为 extraQuery
  - fat-form-group/fat-form-item 网格使用简化, 支持自动检测是否开启了网格

- Updated dependencies
  - @wakeadmin/element-adapter@0.2.3

## 0.5.6

### Patch Changes

- 升级依赖，修复 listener 继承导致的事件触发爆栈问题

## 0.5.5

### Patch Changes

- 新增功能
  - fat-float-footer 兼容微前端基座
  - 新增 currency, float, cascader, cascader-lazy 原件
- Bug 修复
  - fat-table query slots 显示计算优化
- Updated dependencies
  - @wakeadmin/element-adapter@0.2.2

## 0.5.4

### Patch Changes

- fat-table 新增 beforeTable、afterTable 插槽
- 修复: fat-table 再没有任何查询字段时，隐藏查询表单
- 修复: images 值变更后没有触发重新验证
- Updated dependencies
  - @wakeadmin/element-adapter@0.2.1

## 0.5.3

### Patch Changes

- fat-actions 样式优化
- upload 提示语优化

## 0.5.2

### Patch Changes

Bug 修复

- 图片上传 sizeLimit 格式化
- 图片上传支持扩展名验证
- fat-form-modal/drawer 默认关闭遮罩点击
- fat-action disabled 情况下无法显示 title

## 0.5.1

### Patch Changes

- 修改表单的默认分隔符为`:`
- 调整表格的搜索表单样式

### 新功能

- fat-actions 的 title、disabled 支持传入函数
- 新增 simple fat-table 的布局

## 0.5.0

### Minor Changes

#### Bugs 修复

- 修复 fat-table column 无法推断 valueProps 类型
- fat-form-item 预览模式下关闭验证

### 新功能

- fat-form 支持 hideMessageOnPreview
- fat-table 支持 batchActions

## 0.4.2

### Patch Changes

- - 修复 fat-text copy 不生效
  - fat-table 默认关闭 requestOnQueryChange

## 0.4.1

### Patch Changes

- 修复 fat-form 提交值为空

## 0.4.0

### Minor Changes

- 功能优化:

  - define\* 暴露 emit 方法
  - 调整 fat-actions 配色
  - fat-form 新增 getValuesToSubmit 方法、syncToInitialValues prop
  - fat-form 新增 getValues prop
  - fat-actions 新增 confirm 在点击时确认提示
  - fat-table confirm* message* props 支持传入 string

## 0.3.1

### Patch Changes

- - bug 修复

  - fix(components): 修复 fat-text 拷贝事件冲突
  - fix(components): defineFatForm 没有正确暴露 ref

## 0.3.0

### Minor Changes

- 新特性

  - 新增 fat-text、fat-link 组件库
  - 新增 url 原件
  - define\* 相关方法支持访问外部 props, 并支持 extra 额外 props 声明
  - fat-form-layout 相关方法添加 beforeCancel、beforeFinish props 用于干预关闭行为
  - fat-actions 支持 title

- bug 修复

  - fat-table 刷新不清空 list， 避免跳动

<br>

## 0.2.1

### Patch Changes

- 新特性

  - 新增 fat-icon 组件
  - 新增 search 原件
  - select 原件选项支持指定颜色

- bugfixs
  - 修复 sideEffects 导致原件注册失败
  - 修复 fat-form-item disabled, clearable 无法覆盖

## 0.2.0

### Minor Changes

#### 新增 atomics

- images
- image

#### Bugs Fixes

- 修复 fat-table title 默认为空

#### 功能优化

- fat-table actions 支持函数形式
- 插件安装检查

### Patch Changes

- Updated dependencies
  - @wakeadmin/element-adapter@0.2.0
