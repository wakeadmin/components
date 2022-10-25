import { defineFatFormSteps } from '@wakeadmin/components';
import { ElResult } from 'element-plus';

export default defineFatFormSteps(({ step, item, section }) => {
  return () => ({
    direction: 'vertical',
    formWidth: 500,
    children: [
      step({
        title: '基础信息',
        children: [
          section({
            title: '工作信息',
            children: [
              item({ prop: 'name', label: '姓名', required: true, width: 'small' }),
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
                width: 'small',
              }),
            ],
          }),
          section({
            title: '同步表单信息',
            children: [
              item({ prop: 'dateRange', label: '时间区间', valueType: 'date-range', width: 'large' }),
              item({ prop: 'note', label: '备注', valueType: 'textarea', width: 'huge' }),
            ],
          }),
        ],
      }),
      step({
        title: '完成配置',
        children: [
          section({
            children: [<ElResult icon="success" title="💐 恭喜，完成配置"></ElResult>],
          }),
        ],
      }),
    ],
  });
});
