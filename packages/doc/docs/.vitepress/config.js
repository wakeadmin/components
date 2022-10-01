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
            {
              text: 'FatFormConsumer 表单内省',
              link: '/fat-form/consumer',
            },
            {
              text: 'defineFatForm 定义器',
              link: '/fat-form/define',
            },
          ],
        },
        {
          text: 'FatForm 预定义场景',
          items: [
            { text: 'FatFormModal 模态框', link: '/fat-form-layout/modal.md' },
            { text: 'FatFormDrawer 抽屉', link: '/fat-form-layout/drawer.md' },
            { text: 'FatFormPage 页面', link: '/fat-form-layout/page.md' },
            { text: 'FatFormQuery 查询', link: '/fat-form-layout/query.md' },
          ],
        },
        {
          text: 'FatLayout 布局',
          items: [
            { text: 'FatHeader 首部', link: '/fat-layout/header' },
            { text: 'FatFloatFooter 浮动尾部', link: '/fat-layout/float-footer' },
          ],
        },
        {
          text: 'Other 其他',
          items: [],
        },
        {
          text: 'Atomic 原件',
          items: [
            { text: '内置原件', link: '/atomics/index' },
            { text: '自定义原件', link: '/atomics/custom' },
          ],
        },
      ],
    },
  },
};
