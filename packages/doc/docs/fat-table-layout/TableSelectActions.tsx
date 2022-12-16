import { defineFatTableSelect } from '@wakeadmin/components';

export default defineFatTableSelect<any, any, { name: string }>(() => {
  return () => ({
    title: '表格操作',
    async request() {
      return {
        list: new Array(10).fill('S').map((_, i) => ({
          name: `MentalHealth${i + 1}`,
          id: i,
        })),
        total: 10,
      };
    },
    renderBottomToolbar(_, selectedList) {
      const item = selectedList[0];
      if (item) {
        return () => (
          <div>
            当前选中:
            <div>
              名称 -{'>'} {item.name}
            </div>
          </div>
        );
      }
    },
    enablePagination: false,

    rowKey: 'id',

    columns: [
      { label: '名称', prop: 'name' },
      {
        type: 'actions',
        label: '操作',
        // 支持传入一个函数，常用于一些需要动态计算的场景
        actions: () => {
          return [
            {
              name: 'Are you Ready?',
              title: '提示信息',
            },
            {
              name: '我好了',
              type: 'danger',
              onClick(table, row) {
                table.select(row);
              },
            },
            {
              name: '等一下，我还没好',
              type: 'warning',
              onClick(table, row) {
                table.unselect(row);
              },
            },
          ];
        },
      },
    ],
  });
});
