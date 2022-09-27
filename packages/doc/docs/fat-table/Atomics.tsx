import { defineFatTable } from '@wakeadmin/components';

export default defineFatTable(({ column }) => {
  return () => ({
    title: '原件示例',
    async request() {
      return {
        total: 1,
        list: [
          {
            text: '文本, 默认原件',
            status: 0,
            date: Date.now(),
            progress: 50,
            currency: 1024,
            image:
              'https://images.unsplash.com/photo-1663774026607-6836c94f93e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80',
          },
        ],
      };
    },
    enablePagination: false,
    columns: [
      column({
        prop: 'text',
        label: '文本',
        // 同时作为查询表单，
        queryable: true,
        valueProps: { placeholder: '搜索关键字' },
      }),
      column({
        prop: 'status',
        label: '下拉列表',
        queryable: true,
        valueType: 'select',
        valueProps: {
          colorMode: 'dot',
          options: [
            { label: '选项1', value: 0, color: 'red' },
            { label: '选项2', value: 1, color: 'blue' },
          ],
        },
      }),
      column({
        prop: 'date',
        label: '时间',
        queryable: true,
        valueType: 'date',
      }),
      column({
        prop: 'progress',
        label: '进度',
        valueType: 'progress',
      }),
      column({ prop: 'currency', label: '货币', valueType: 'currency' }),
      column({ prop: 'image', label: '图片', valueType: 'image' }),
    ],
  });
});
