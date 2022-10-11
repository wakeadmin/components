import { ElButton } from 'element-plus';
import { defineFatTable } from '@wakeadmin/components';

export default defineFatTable(() => {
  return () => ({
    title: '表格插槽',
    async request() {
      return {
        list: new Array(10).fill(0).map((_, idx) => {
          return { id: idx };
        }),
        total: 10,
      };
    },
    renderToolbar() {
      return (
        <div>
          <ElButton>批量操作</ElButton>
          <ElButton>批量操作</ElButton>
        </div>
      );
    },
    renderBottomToolbar() {
      return (
        <div>
          <ElButton>批量操作</ElButton>
          <ElButton>批量操作</ElButton>
        </div>
      );
    },
    columns: [
      {
        label: '快乐',
        prop: 'id',
      },
    ],
  });
});
