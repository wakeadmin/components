export default {
  title: '@wakeadmin/components',
  description: '惟客云组件库',
  head: [
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/viewerjs@1.10.5/dist/viewer.min.css' }],
    [
      'script',
      {
        src: 'https://cdn.jsdelivr.net/npm/viewerjs@1.10.5/dist/viewer.min.js',
      },
    ],
  ],
  themeConfig: {
    sidebar: {
      '/': [
        {
          text: '开始',
          items: [
            {
              text: '安装',
              link: '/base/install',
            },
            {
              text: '基本概念',
              link: '/base/concepts',
            },
          ],
        },
        {
          text: '组件',
          items: [
            {
              text: 'FatTable (表格)',
              link: '/fat-table/index',
            },
          ],
        },
      ],
    },
  },
};
