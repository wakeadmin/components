import { FatFormTableSortType, defineFatForm } from '@wakeadmin/components';

export default defineFatForm(({ item, table, tableColumn, consumer, group }) => {
  return () => ({
    children: [
      item({ label: '标题', prop: 'title', width: 'small' }),
      table({
        prop: 'list',
        label: '详情',
        width: 700,
        columns: [
          tableColumn({
            prop: 'name',
            label: '姓名',
            // 表单项级别的验证规则
            required: true,
          }),
        ],
        // 🔴 开启排序
        sortable: true,

        // 🔴 自定义排序规则, 可选
        sortableProps: {
          type: FatFormTableSortType.ByDrag,
          rowSortable(params) {
            // 索引为偶数的可以排序
            return params.index % 2 === 0;
          },
        },
      }),
      consumer(form =>
        group({
          label: '当前值',
          children: (
            <pre>
              <code>{JSON.stringify(form.values, null, 2)}</code>
            </pre>
          ),
        })
      ),
    ],
  });
});
