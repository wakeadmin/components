import { defineFatTableSelect } from '@wakeadmin/components';
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

export default defineFatTableSelect<Item, Query, { name: string; id: number }>(({ column }) => {
  return () => ({
    title: '明月如霜',
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
    renderBottomToolbar(_, selectedList) {
      const item = selectedList[0];
      if (item) {
        return () => (
          <div>
            当前选中:
            <div>
              名称 -{'>'} {item.name}
            </div>
            <div>
              id -{'>'} {item.id}
            </div>
          </div>
        );
      }
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
        minWidth: 110,
      }),
    ],
  });
});
