const { defineConfig } = require('@vue/cli-service');
const { defineMappChild } = require('@wakeadmin/vue-cli-plugin-mapp-child');
// 后台服务器地址
const SERVER = process.env.SERVER || 'https://www.wakecloud.com';

module.exports = defineConfig({
  transpileDependencies: [/(wakeapp|wakeadmin)/],
  pluginOptions: {
    ...defineMappChild({
      mapp: {
        activeRule: '/dsp.html',
      },
    }),
  },
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
    allowedHosts: 'all',
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
});
