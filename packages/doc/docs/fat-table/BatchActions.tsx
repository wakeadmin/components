import { defineFatTable } from '@wakeadmin/components';
import { reactive } from 'vue';

import ActionsForm from './ActionsForm';

export default defineFatTable(() => {
  const initialValue = reactive({
    disableDelete: false,
    editable: true,
  });

  return () => ({
    title: '表格操作',
    async request() {
      return {
        list: new Array(10).fill(0).map((_, idx) => {
          return { id: idx };
        }),
        total: 10,
      };
    },
    rowKey: 'id',
    async remove(list) {
      // 在这里进行表格删除数据请求
    },
    enableSelect: true,
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
      {
        label: '快乐',
        prop: 'id',
      },
    ],
  });
});
