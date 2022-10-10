# @wakeadmin/components

## 0.6.0

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

## 0.5.7

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