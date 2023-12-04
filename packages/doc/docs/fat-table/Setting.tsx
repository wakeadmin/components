import { defineFatTable } from '@wakeadmin/components';
import { reactive } from 'vue';

export default defineFatTable(({ column }) => {
  const initialValue = reactive({
    disableDelete: false,
    editable: true,
  });

  return () => ({
    title: '表格设置',
    async request() {
      return {
        list: new Array(10).fill(0).map((_, idx) => {
          return { id: idx, name: `name-${idx}` };
        }),
        total: 10,
      };
    },
    rowKey: 'id',
    async remove(list) {
      // 在这里进行表格删除数据请求
    },
    enableSelect: true,
    enableSetting: true,
    settingProps: {
      persistentKey: 'hello-world',
    },
    renderToolbar() {
      return <div style={{ marginRight: '10px' }}>custom toolbar</div>;
    },
    batchActions: table => [
      {
        name: '删除',
        onClick: table.removeSelected,
      },
      {
        name: '导出',
        confirm: '确认导出',
        onClick: () => console.log('导出操作'),
      },
    ],
    columns: [
      column({
        label: 'ID',
        prop: 'id',
      }),
      column({
        label: '名称',
        prop: 'name',
      }),
      column({
        type: 'actions',
        label: '操作',
        actions: [
          {
            name: '编辑',
          },
        ],
      }),
    ],
  });
});
