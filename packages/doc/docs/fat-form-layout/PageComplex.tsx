import { defineFatFormPage } from '@wakeadmin/components';

export default defineFatFormPage(({ item, section }) => {
  return () => ({
    title: '新增 XX',
    children: [
      section({
        title: '个人信息',
        children: [
          item({ label: '名称', prop: 'name', width: 'medium', rules: { required: true } }),
          item({ label: '昵称', prop: 'nickName', width: 'medium', rules: { required: true } }),
          item({ label: '地址', prop: 'address', valueType: 'textarea', width: 'huge' }),
        ],
      }),
      section({
        title: '详细信息',
        children: [item({ label: '详细描述', prop: 'detail', width: 'huge', valueType: 'textarea' })],
      }),
    ],
  });
});
