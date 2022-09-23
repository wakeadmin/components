# @wakeadmin/components

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
