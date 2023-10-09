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
  base: process.env.NODE_ENV === 'production' ? '/components/' : '/',
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
      {
        text: '主站',
        link: 'https://wakeadmin.wakedata.com',
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
              text: '🏃🏻‍♀️ FatTable',
              link: '/fat-table/',
            },
            {
              text: '🏃🏻‍♀️ defineFatTable',
              link: '/fat-table/define',
            },
            {
              text: '🙋 FAQ',
              link: '/fat-table/faq',
            },
          ],
        },
        {
          text: 'FatTable 预定义场景',
          items: [
            {
              text: 'FatTableModal(alpha)',
              link: '/fat-table-layout/modal',
            },
            {
              text: 'FatTableDrawer(alpha)',
              link: '/fat-table-layout/drawer',
            },
            {
              text: 'FatTableSelect(alpha)',
              link: '/fat-table-layout/table-select',
            },
            {
              text: 'FatTableSelectModal(alpha)',
              link: '/fat-table-layout/table-select-modal',
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
              text: '🏃🏻‍♀️ defineFatForm 定义器',
              link: '/fat-form/define',
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
          ],
        },
        {
          text: 'FatForm 预定义场景',
          items: [
            { text: 'FatFormModal 模态框', link: '/fat-form-layout/modal' },
            { text: 'FatFormDrawer 抽屉', link: '/fat-form-layout/drawer' },
            { text: 'FatFormPage 页面', link: '/fat-form-layout/page' },
            { text: 'FatFormQuery 查询', link: '/fat-form-layout/query' },
            { text: 'FatFormSteps 分步 (beta)', link: '/fat-form-layout/steps' },
            { text: 'FatFormTabs 标签页 (beta)', link: '/fat-form-layout/tabs' },
            { text: 'FatFormTable 表格数组 (beta)', link: '/fat-form-layout/table' },
          ],
        },
        {
          text: 'FatDragDrop 拖拽(alpha)',
          items: [
            { text: '基本使用', link: '/fat-drag-drop/' },
            { text: '高级', link: '/fat-drag-drop/advanced' },
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
            {
              text: '🙋 FAQ',
              link: '/atomics/faq',
            },
          ],
        },
        {
          text: 'Other 其他',
          items: [
            { text: 'FatSpace 间距', link: '/other/space' },
            { text: 'FatIcon 图标', link: '/other/icon' },
            { text: 'FatSwitch 开关', link: '/other/switch' },
            { text: 'FatTreeSelect 树选择器', link: '/other/tree-select' },
            { text: 'FatLogicTree 逻辑树 (alpha)', link: '/other/logic-tree' },
            { text: 'FatImageVerification 图片验证码 (alpha)', link: '/other/image-verification' },
            { text: 'FatImport 导入模块框 (alpha)', link: '/other/fat-import' },
            { text: 'FatI18nContent 内容多语言 (alpha)', link: '/other/fat-i18n-content' },
            { text: 'FatVNode VNode渲染', link: '/other/vnode' },
            { text: 'FatText/FatLink 文本', link: '/other/text' },
            { text: 'I18n 国际化 (alpha)', link: '/other/i18n' },
          ],
        },
      ],
    },
    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/wakeadmin/components',
      },
      {
        icon: {
          svg: `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="codesandbox-icon"><title>codesandbox</title><path d="M14 4.69998L8.01676 7.99562C8.00621 8.00143 7.99379 8.00143 7.98324 7.99562L2 4.69998M8 7.99998V14.6666M13.9897 11.3381L8.00838 14.6644C8.00311 14.6674 7.99689 14.6674 7.99162 14.6644L2.01033 11.3381C2.004 11.3346 2 11.3274 2 11.3195L2 4.70712C2 4.69929 2.00397 4.69212 2.01027 4.68859L7.99156 1.33554C7.99687 1.33257 8.00313 1.33257 8.00843 1.33554L13.9897 4.68859C13.996 4.69212 14 4.69929 14 4.70712V11.3195C14 11.3274 13.996 11.3346 13.9897 11.3381Z" stroke="currentColor" stroke-linejoin="round"></path></svg>`,
        },
        link: 'https://codesandbox.io/p/sandbox/wakeadmin-components-fc4x8x',
        ariaLabel: 'codesandbox',
      },
    ],
  },
};
