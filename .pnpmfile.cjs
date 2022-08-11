function readPackage(pkg, context) {
  if (pkg.peerDependencies) {
    // 不处理 vue 相关 peerDependencies 手动修复
    const keys = Object.keys(pkg.peerDependencies);
    for (const key of keys) {
      if (key.startsWith('vue') || key.startsWith('@vue')) {
        delete pkg.peerDependencies[key];
      }
    }
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
