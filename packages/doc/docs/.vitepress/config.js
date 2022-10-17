const commonHeads = [
  ['meta', { name: 'google-site-verification', content: 'JrmhhHwR9CgKUyPUL9cqjJGDpDnK_E72RP0tK8OwNBs' }],
  ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/viewerjs@1.10.5/dist/viewer.min.css' }],
  [
    'script',
    {
      src: 'https://cdn.jsdelivr.net/npm/viewerjs@1.10.5/dist/viewer.min.js',
    },
  ],
];

export default {
  outDir: '../dist',
  base: process.env.NODE_ENV === 'production' ? '/components-doc/' : '/',
  title: '@wakeadmin/components',
  description: '惟客云组件库',
  lastUpdated: true,
  logo: '/logo.png',
  head:
    process.env.NODE_ENV === 'production'
      ? [
          ...commonHeads,
          [
            'script',
            {},
            `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?8f89c6abfda75f0236c445c32f4940aa";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`,
          ],
        ]
      : [...commonHeads],
  footer: {
    message: '客户经营，找惟客',
    copyright: 'Copyright © 2022-present WakeData',
  },
  themeConfig: {
    nav: [
      {
        text: '组件文档',
        link: '/base/install',
      },
      {
        text: '变更记录',
        link: '/base/change-log',
      },
    ],
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
              text: 'Typescript / JSX',
              link: '/base/typescript',
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
              link: '/fat-table/',
            },
          ],
        },
        {
          text: 'FatForm 表单',
          items: [
            {
              text: 'FatForm 表单',
              link: '/fat-form/',
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
            { text: 'FatFormModal 模态框', link: '/fat-form-layout/modal' },
            { text: 'FatFormDrawer 抽屉', link: '/fat-form-layout/drawer' },
            { text: 'FatFormPage 页面', link: '/fat-form-layout/page' },
            { text: 'FatFormQuery 查询', link: '/fat-form-layout/query' },
          ],
        },
        {
          text: 'FatConfigurable 全局配置',
          items: [{ text: 'FatConfigurable', link: '/fat-configurable/' }],
        },
        {
          text: 'FatLayout 布局',
          items: [
            { text: 'FatCard 卡片', link: '/fat-layout/card' },
            { text: 'FatContainer 容器', link: '/fat-layout/container' },
            { text: 'FatFloatFooter 浮动尾部', link: '/fat-layout/float-footer' },
          ],
        },
        {
          text: 'Atomic 原件',
          items: [
            { text: '内置原件', link: '/atomics/' },
            { text: '自定义原件', link: '/atomics/custom' },
          ],
        },
        {
          text: 'Other 其他',
          items: [
            { text: 'FatSpace 间距', link: '/other/space' },
            { text: 'FatIcon 图标', link: '/other/icon' },
            { text: 'FatSwitch 开关', link: '/other/switch' },
          ],
        },
      ],
    },
  },
};
