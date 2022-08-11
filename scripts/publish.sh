#!/usr/bin/env bash

# 每日发布, 私有环境

# 需要配置的环境变量
# NPM_USER npm 用户名
# NPM_PASS npm 密码
# NPM_EMAIL npm 邮箱
# NPM_REGISTRY npm 仓库
# DOCKER_USER docker 用户
# DOCKER_PASSWORD docker 用户密码
# DOCKER_SERVER docker 仓库, 可选，默认为 docker hub

set -e
set -x

# NPM 发布仓库默认值
export NPM_REGISTRY=${NPM_REGISTRY-"http://npm.wakedata-inc.com"}

env
node -v

echo "开始每日发布"

npm i -g pnpm npm-cli-login
pnpm install

# 构建
echo '开始构建'
pnpm run build

# 登录 npm
npm-cli-login

# 发布 npm
echo '开始发布 npm 模块'
pnpm publish -r --no-git-checks --registry=$NPM_REGISTRY --access public

# 构建基座容器
echo '开始构建基座'
pnpm run -r build:assets
pnpm run -r build:docker
pnpm run -r publish:docker
