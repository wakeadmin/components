const { update } = require('@wakeadmin/docker-build');
const { PRODUCTION, DOCKER_IMAGE_NAME, DOCKER_VERSION, WORKLOAD } = require('./shared');

// Rancher 项目名称
const PROJECT = process.env.PROJECT;

if (!PRODUCTION && PROJECT) {
  update(DOCKER_IMAGE_NAME, DOCKER_VERSION, {
    project: PROJECT,
    workload: WORKLOAD,
  });
}
