import { defineFatFormSteps } from '@wakeadmin/components';

export default defineFatFormSteps(({ step, item }) => {
  return () => ({
    // 支持设置表单区域的宽度，表单区域会自动居中
    formWidth: 500,
    children: [
      step({
        title: '工作信息',
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
      step({
        title: '同步表单信息',
        children: [
          item({ prop: 'dateRange', label: '时间区间', valueType: 'date-range' }),
          item({ prop: 'note', label: '备注', valueType: 'textarea' }),
        ],
      }),
    ],
  });
});
