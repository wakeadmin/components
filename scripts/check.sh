#!/usr/bin/env bash

# 规范检查

set -e
set -x

env
node -v

echo "开始规范化检查"

npm i -g pnpm
pnpm install --no-frozen-lockfile

# eslint 检查
pnpm wkstd gerrit-check

# 单元测试
pnpm run test
