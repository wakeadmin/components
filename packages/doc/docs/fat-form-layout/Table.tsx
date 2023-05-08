import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm(({ item, table, tableColumn, consumer, group }) => {
  return () => ({
    children: [
      item({ label: '标题', prop: 'title', width: 'small' }),
      table({
        prop: 'list',
        label: '详情',
        width: 700,
        // list 数组本身的验证规则
        required: true,
        columns: [
          tableColumn({
            prop: 'name',
            label: '姓名',
            width: 'mini',
            // 表单项级别的验证规则
            required: true,
          }),
          tableColumn({
            prop: 'address',
            label: '地址',
            valueType: 'textarea',
            valueProps: {
              maxlength: 100,
              showWordLimit: true,
            },
            required: true,
          }),
          tableColumn({ prop: 'enabled', label: '状态', valueType: 'switch', width: 'mini' }),
        ],
        // 自定义文案
        createText: '新增一行',
        removeText: '删除',
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
