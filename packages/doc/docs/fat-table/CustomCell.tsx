import { defineFatTable } from '@wakeadmin/components';
import { ElAvatar, ElSpace } from 'element-plus';

/**
 * 列表项定义
 */
interface Item {
  id: number;
  name: string;
  avatar: string;
}

/**
 * 表单查询
 */
interface Query {
  name: string;
}

export default defineFatTable<Item, Query>(({ column }) => {
  return () => ({
    title: '自定义单元格',
    rowKey: 'id',
    async request(params) {
      const { pagination, query } = params;

      // 模拟请求
      const mockData: Item[] = new Array(pagination.pageSize).fill(0).map((_, idx) => {
        const r = Math.floor(Math.random() * 1000);
        return {
          id: idx,
          name: `${r}-${pagination.page}-${query?.name ?? ''}`,
          avatar: 'https://avatars.githubusercontent.com/u/15975785?v=4&size=64',
        };
      });

      return {
        list: mockData,
        total: 100,
      };
    },
    columns: [
      // 🔴 纯查询表单
      // 假设我们这里支持名称搜索
      column({
        type: 'query', // 🔴 设置为 query 表示不会作为单元格
        queryable: 'name',
        valueType: 'search',
      }),

      // 🔴 自定义单元格渲染
      column({
        label: '用户',
        render(_v, row) {
          return (
            <ElSpace>
              <ElAvatar src={row.avatar}></ElAvatar>
              <span>{row.name}</span>
            </ElSpace>
          );
        },
      }),
    ],
  });
});
