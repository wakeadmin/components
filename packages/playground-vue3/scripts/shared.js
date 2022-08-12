const pkg = require('../package.json');

// 行业
const PRODUCTION = process.env.STAGE === 'PRODUCTION';
const NOW = new Date();
const BUILD_ID =
  process.env.BUILD_ID ??
  `${NOW.getFullYear()}${NOW.getMonth() + 1}${NOW.getDate()}${NOW.getHours()}${NOW.getMinutes()}`;

// 镜像名称
const DOCKER_IMAGE_NAME = pkg.imageName;

// 镜像版本
let DOCKER_VERSION = pkg.version;

if (!PRODUCTION) {
  // 非正式版本使用 `-snapshot-BUILD`
  DOCKER_VERSION = DOCKER_VERSION + `-snapshot-${BUILD_ID}`;
}

const WORKLOAD = pkg.workload
const DOCKER_PUBLISH_LATEST = process.env.DOCKER_PUBLISH_LATEST !== 'false'

module.exports = {
  DOCKER_IMAGE_NAME,
  DOCKER_VERSION,
  PRODUCTION,
  WORKLOAD,
  DOCKER_PUBLISH_LATEST,
};
