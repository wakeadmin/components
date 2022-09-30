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
          text: 'FatTable 表格',
          items: [
            {
              text: 'FatTable',
              link: '/fat-table/index',
            },
          ],
        },
        {
          text: 'FatForm 表单',
          items: [
            {
              text: 'FatForm 表单',
              link: '/fat-form/index',
            },
            {
              text: 'FatFormItem 表单项',
              link: '/fat-form/item',
            },
            {
              text: 'FatFormGroup 表单组',
              link: '/fat-form/group',
            },
            {
              text: 'FatFormSection 表单分类',
              link: '/fat-form/section',
            },
          ],
        },
      ],
    },
  },
};
