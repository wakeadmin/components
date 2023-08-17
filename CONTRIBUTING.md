# Contributing Guide

嗨！我很高兴你有兴趣为 wakeadmin/components 做出贡献。在提交您的贡献之前，请确保花一点时间阅读以下指南

- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [问题报告指南](#问题报告指南)
- [拉取请求指南](#拉取请求指南)
- [提交更改](#提交更改)

## 问题报告指南

- 使用 [https://github.com/wakeadmin/components/issues/new](https://github.com/wakeadmin/components/issues/new) 进行创建新的问题.

## 拉取请求指南

- 目前我们的直接采用`master`作为最终版本以及对应的开发版本，因此我们直接从`master`拉取一条新的分支作为我们的开发分支，最终再合并回`master`

- 当你在 PR 上工作时，拥有多个小的提交是可以的 - GitHub 会在合并之前自动压缩它。

- 确保 pnpm test 通过。

  如果添加新功能：

  - 添加相应的测试案例。

  - 提供一个令人信服的理由来添加此功能。理想情况下，您应该首先打开一个建议问题，并在其上工作之前获得批准。

  如果是 bug 修复：

  - 如果你正在解决一个特定的问题，请在你的 PR 标题中添加 (fix #xxxx[,#xxxx]) (#xxxx 是问题 id) 以获得更好的发布日志。

  - 最好在 PR 中提供有关错误的详细描述。

  - 如果可以的话，添加对应的测试覆盖范围。

### 提交更改

提交消息应遵循提交消息约定，以便可以自动生成变更日志。在提交时，提交消息将自动进行验证。

#### 提交信息格式

```text
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

其中，`body` 和 `footer` 为可选。

#### Type

必须是以下之一：

- feat: 增加新功能
- fix: bug 修复
- docs: 文档更改
- style: 不影响代码意义的更改（如空白、格式化、遗失的分号等）
- refactor: 既不修复错误也不添加功能的代码更改
- perf: 提高性能的代码更改
- test: 添加缺失的测试
- chore: 更改构建过程或辅助工具和库，如文档生成

#### Scope

指定提交更改位置的子包，比如 `components`，`adapter`。

#### Subject

`Subject`包含了更改的简洁描述：

- 不要大写第一个字母
- 句子末尾不要点（.）

#### Body

跟`Subject`中一样，`Body`应该包括更改的动机，并与以前的行为形成对比。

#### footer

`footer`应该包含任何有关破坏性更改的信息，也是引用此提交关闭的 GitHub 问题的地方。

破坏性更改应该以 `BREAKING CHANGE: `开头，后面跟一个空格或两个换行。提交消息的其余部分然后用于此目的。
