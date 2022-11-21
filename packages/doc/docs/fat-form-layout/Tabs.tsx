import { defineFatFormTabs } from '@wakeadmin/components';

export default defineFatFormTabs(({ tabPane, item }) => {
  return () => {
    return {
      submit: async values => {
        console.log('表单提交');
      },
      children: [
        tabPane({
          label: '工作信息',
          name: 'work',
          children: [
            item({ prop: 'name', label: '姓名', required: true }),
            item({
              prop: 'type',
              label: '工作类型',
              valueType: 'select',
              valueProps: {
                options: [
                  { value: 0, label: '国企' },
                  { value: 1, label: '私企' },
                ],
              },
            }),
          ],
        }),
        tabPane({
          label: '同步表单信息',
          name: 'sync',
          children: [
            item({ prop: 'dateRange', label: '时间区间', valueType: 'date-range' }),
            item({ prop: 'note', label: '备注', valueType: 'textarea' }),
          ],
        }),
      ],
    };
  };
});
