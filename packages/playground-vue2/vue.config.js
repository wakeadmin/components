const { defineConfig } = require('@vue/cli-service');
const express = require('express');
const multer = require('multer');

const upload = multer({ dest: '.upload-demo' });

// 后台服务器地址
const SERVER = process.env.SERVER || 'https://www.wakecloud.com';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  transpileDependencies: [/(wakeapp|wakeadmin)/],
  publicPath: IS_PRODUCTION ? `[%= cdnDomain ? '//' + cdnDomain : ''  %]/` : '/',
  configureWebpack() {
    return {
      cache: {
        type: 'filesystem',
        buildDependencies: {
          // This makes all dependencies of this file - build dependencies
          config: [__filename],
          // By default webpack and loaders are build dependencies
        },
      },
      // 可以获取更好的调试体验
      devtool: 'source-map',
    };
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: 'all',
    // 模拟上传
    onBeforeSetupMiddleware: devServer => {
      devServer.app.use(express.static('.upload-demo'));
      devServer.app.post('/upload-demo', upload.single('file'), (req, res, next) => {
        res.json({ id: req.file.filename });
      });
    },
    // 配置代理
    proxy: ['/api', '/wd'].reduce((prev, cur) => {
      prev[cur] = {
        target: SERVER,
        changeOrigin: true,
        secure: false,
        // 修改 cookie
        onProxyRes(proxyRes) {
          const cookies = proxyRes.headers['set-cookie'];
          if (cookies) {
            const newCookie = cookies.map(function (cookie) {
              return cookie.replace(/Domain=.*?(\.\w+\.\w+);/i, 'Domain=$1;');
            });
            // 修改cookie path
            delete proxyRes.headers['set-cookie'];
            proxyRes.headers['set-cookie'] = newCookie;
          }
        },
      };
      return prev;
    }, {}),
  },
  lintOnSave: false,
});
