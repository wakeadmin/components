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
interface Query {}

export default defineFatTable<Item, Query>(({ column }) => {
  return () => ({
    title: '组装原件数据',
    rowKey: 'id',
    async request(params) {
      const { pagination, query } = params;

      // 模拟请求
      const mockData: Item[] = new Array(pagination.pageSize).fill(0).map((_, idx) => {
        const r = Math.floor(Math.random() * 1000);
        return {
          id: idx,
          name: `${r}-${pagination.page}`,
          avatar: 'https://avatars.githubusercontent.com/u/15975785?v=4&size=64',
        };
      });

      return {
        list: mockData,
        total: 100,
      };
    },
    columns: [
      column({
        label: '用户',
        valueType: 'avatar',
        // 🔴 按照 avatar 的 value 类型传值
        getter(row) {
          return {
            avatar: row.avatar,
            title: row.name,
            description: '13732332333',
          };
        },
      }),
    ],
  });
});
