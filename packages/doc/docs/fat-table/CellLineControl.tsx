import { defineFatTable } from '@wakeadmin/components';
import { ElAvatar, ElMessageBox, ElSpace } from 'element-plus';

/**
 * 列表项定义
 */
interface Item {
  one: string;
  two: string;
  three: string;
  four: number;
}

export default defineFatTable<Item>(({ column }) => {
  return () => ({
    title: '表格换行控制',
    rowKey: 'id',
    async request(params) {
      const { pagination, query } = params;

      // 模拟请求
      const mockData: Item[] = new Array(pagination.pageSize).fill(0).map((_, idx) => {
        const r = Math.floor(Math.random() * 1000);
        return {
          id: idx,
          one: '1' + '数据'.repeat(r % 100),
          two: '2' + '数据'.repeat(r % 100),
          three: '3' + '数据'.repeat(r % 100),
          four: 1,
        };
      });

      return {
        list: mockData,
        total: 100,
      };
    },
    columns: [
      column({
        label: '单行省略',
        prop: 'one',
        // 🔴 单行省略, 使用 el-table-column 自带的 showOverflowTooltip
        showOverflowTooltip: true,
      }),
      column({
        label: '多行省略',
        prop: 'two',
        valueProps: {
          // 🔴 多行省略, 使用默认文本类型、select 类型原件都支持
          ellipsis: 3,
        },
      }),
      column({
        label: '单行省略',
        prop: 'three',
        showOverflowTooltip: true,
      }),
      column({
        label: '下拉选择器',
        prop: 'four',
        valueType: 'select',
        valueProps: {
          ellipsis: 2,
          options: [
            {
              label: '很长很长很长很长很长很长很长很长很长很长很长很长很长很长',
              value: 1,
            },
          ],
        },
      }),
      column({
        label: '输入框',
        prop: '_',
        width: 200,
        showOverflowTooltip: true,
        columnMode: 'editable',
      }),
    ],
  });
});
