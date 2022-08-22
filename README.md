# wakeadmin 组件库

# 在 .vue 文件下使用 jsx

eslint 配置

```js
// 支持 .vue 文件中 包含 jsx
const ts = require('typescript');
const { ensureScriptKind } = ts;
ts.ensureScriptKind = function (fileName, ...args) {
  if (fileName.endsWith('.vue')) {
    return ts.ScriptKind.TSX;
  }
  return ensureScriptKind.call(this, fileName, ...args);
};
```

vue2

升级到 2.7.10+
