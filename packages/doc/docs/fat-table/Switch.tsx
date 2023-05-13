import { defineFatTable } from '@wakeadmin/components';
import { ElAvatar, ElMessageBox, ElSpace } from 'element-plus';

/**
 * 列表项定义
 */
interface Item {
  id: number;
  name: string;
  open: boolean;
}

/**
 * 表单查询
 */
interface Query {
  name: string;
  open: boolean;
}

export default defineFatTable<Item, Query>(({ column }) => {
  return () => ({
    title: 'Switch 开关示例',
    rowKey: 'id',
    async request(params) {
      const { pagination, query } = params;

      // 模拟请求
      const mockData: Item[] = new Array(pagination.pageSize).fill(0).map((_, idx) => {
        const r = Math.floor(Math.random() * 1000);
        return {
          id: idx,
          name: `${r}-${pagination.page}-${query?.name ?? ''}`,
          open: false,
        };
      });

      return {
        list: mockData,
        total: 100,
      };
    },
    columns: [
      column({
        label: '名称',
        prop: 'name',
        queryable: true,
        valueType: 'search',
      }),

      // 开关状态搜索
      column({
        label: '状态',
        type: 'query',
        prop: 'open',
        valueType: 'select',
        valueProps: {
          options: [
            { label: '开', value: true },
            { label: '关', value: false },
          ],
        },
      }),

      // 开关列
      column({
        label: '状态',
        prop: 'open',
        valueType: 'switch',
        // 🔴 强制设置为编辑模式
        columnMode: 'editable',
        valueProps: {
          beforeChange: async value => {
            await ElMessageBox.confirm('确定切换?');

            // 🔴 在这里请求后端接口

            return true;
          },
        },
      }),
    ],
  });
});
