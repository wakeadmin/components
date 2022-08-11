#!/usr/bin/env bash

# 每日发布, 私有环境

# 需要配置的环境变量
# NPM_TOKEN npm 用户名
# DOCKER_USER docker 用户
# DOCKER_PASSWORD docker 用户密码
# DOCKER_SERVER docker 仓库, 可选，默认为 docker hub

set -e
set -x

# NPM 发布仓库默认值
export NPM_REGISTRY=${NPM_REGISTRY-"https://registry.npmjs.org/"}

env
node -v

echo "开始每周发布"

npm i -g pnpm
pnpm install

# 构建
echo '开始构建'
pnpm run build

# 登录
npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN

# 发布 npm
echo '开始发布 npm 模块'
pnpm publish -r --no-git-checks --registry=$NPM_REGISTRY --access public

# 构建基座容器
echo '开始构建基座'
pnpm run -r build:assets
pnpm run -r build:docker
pnpm run -r publish:docker
