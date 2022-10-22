import { defineFatForm } from '@wakeadmin/components';

enum Type {
  Or,
  And,
  None,
}

interface Values {
  type: Type;
  conditions: string[];
}

export default defineFatForm<Values>(({ group, renderChild, item }) => {
  return () => {
    return {
      initialValue: {
        type: Type.Or,
        conditions: [],
      },
      layout: 'vertical',
      children: [
        group({
          label: '触发条件',
          gutter: 'sm',
          children: [
            item({
              prop: 'type',
              valueType: 'radio',
              valueProps: {
                options: [
                  {
                    label: '满足一项选中条件即可',
                    value: Type.Or,
                  },
                  {
                    label: '满足全部选中条件',
                    value: Type.And,
                  },
                  {
                    label: '无限制',
                    value: Type.None,
                  },
                ],
              },
              // 依赖于 conditions, 即 conditions 变化时会触发它重新验证
              dependencies: 'conditions',
              rules: values => ({
                validator(_rule, value, callback) {
                  if (value !== Type.None && !values.conditions?.length) {
                    callback(new Error('请选择至少一条触发时间条件'));
                  } else {
                    callback();
                  }
                },
              }),
            }),
            // group 可以控制下级的一些状态，比如 disabled
            group({
              disabled: f => f.values.type === Type.None,
              children: [
                item({
                  prop: 'conditions',
                  valueType: 'checkboxs',
                  valueProps: {
                    // 垂直布局
                    vertical: true,
                    options: [
                      {
                        label: active =>
                          renderChild(
                            group({
                              // 当选项未选中时禁用表单, 如果选中，传入 undefined, 让 group 从父级继承 disabled 状态
                              disabled: !active ? true : undefined,
                              children: [
                                '每年',
                                item({
                                  prop: 'year.dateRange',
                                  valueType: 'date-range',
                                  required: true,
                                  width: 'small',
                                }),
                                '时间段',
                                item({
                                  prop: 'year.timeRange',
                                  valueType: 'time-range',
                                  required: true,
                                  width: 'small',
                                }),
                              ],
                            })
                          ),
                        value: 'year',
                      },
                      {
                        label: active =>
                          renderChild(
                            group({
                              // 当选项未选中时禁用表单
                              disabled: !active ? true : undefined,
                              children: [
                                '每月',
                                item({
                                  prop: 'month.date',
                                  valueType: 'select',
                                  valueProps: {
                                    options: [{ value: 1, label: '1' }],
                                  },
                                  width: 'mini',
                                  required: true,
                                }),
                                '时间段',
                                item({
                                  prop: 'month.timeRange',
                                  width: 'small',
                                  valueType: 'time-range',
                                  required: true,
                                }),
                              ],
                            })
                          ),
                        value: 'month',
                      },
                    ],
                  },
                }),
              ],
            }),
          ],
        }),
      ],
    };
  };
});
