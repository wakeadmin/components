import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm(({ item, table, tableColumn, consumer, group }) => {
  let uid = 0;
  return () => ({
    children: [
      table({
        prop: 'list',
        label: '详情',
        width: 700,
        rowKey: 'id',
        // 关闭删除提示
        removeConfirm: false,
        beforeCreate() {
          const id = uid++;
          return {
            id,
            name: `ivan-${id}`,
            address: '广东省汕尾市',
          };
        },
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
            required: true,
          }),
        ],
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
