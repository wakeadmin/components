import { defineFatTable } from '@wakeadmin/components';
import { ElButton } from 'element-plus';

enum ItemStatus {
  Initial,
  Pending,
  Done,
}

/**
 * 列表项定义
 */
interface Item {
  id: number;
  name: string;
  status: ItemStatus;
  createdDate: number;
}

/**
 * 表单查询
 */
interface Query {
  name: string;
  status: ItemStatus;
}

export default defineFatTable<Item, Query>(({ column }) => {
  return () => ({
    title: 'Hello',
    rowKey: 'id',
    async request(params) {
      const { pagination, query } = params;

      // 模拟请求
      const mockData: Item[] = new Array(pagination.pageSize).fill(0).map((_, idx) => {
        const r = Math.floor(Math.random() * 1000);
        return {
          id: idx,
          name: `${r}-${pagination.page}-${query?.name ?? ''}`,
          status: r % 3 === 0 ? ItemStatus.Pending : r % 2 === 0 ? ItemStatus.Initial : ItemStatus.Done,
          createdDate: Date.now(),
        };
      });

      return {
        list: mockData,
        total: 100,
      };
    },
    renderNavBar() {
      return (
        <span>
          <ElButton type="primary">创建</ElButton>
        </span>
      );
    },
    columns: [
      column({
        prop: 'name',
        label: '名称',
        queryable: true,
        valueType: 'search',
      }),
      column({
        prop: 'status',
        label: '状态',
        queryable: true,
        valueType: 'select',
        valueProps: {
          options: [
            { label: '未开始', value: ItemStatus.Initial, color: 'blue' },
            { label: '正在进行', value: ItemStatus.Pending, color: 'green' },
            { label: '已结束', value: ItemStatus.Done, color: 'gray' },
          ],
        },
      }),
      column({
        prop: 'createdDate',
        label: '创建时间',
        valueType: 'date-time',
      }),
      column({
        type: 'actions',
        label: '操作',
        actions: (table, row) => {
          const ended = row.status === ItemStatus.Done;
          const pending = row.status === ItemStatus.Pending;

          return [
            {
              name: pending ? '结束' : '开始',
              visible: !ended,
            },
            {
              name: '删除',
              type: 'danger',
              onClick: () => table.remove(row),
            },
          ];
        },
      }),
    ],
  });
});
