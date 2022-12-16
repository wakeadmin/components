import { defineFatTableSelect } from '@wakeadmin/components';
import { defineComponent, ref } from 'vue';
import { ElButton } from 'element-plus';

export default defineComponent({
  name: 'TableSelectDisabledActions',
  setup() {
    const multiple = ref(false);
    const Table = defineFatTableSelect<any, any, { name: string; id: number }>(({ column }) => {
      const list = [
        { name: '女曰鸡鸣', id: 51024 },
        { name: '士曰昧旦', id: 15629 },
        { name: '子兴视夜', id: 588 },
        { name: '明星有烂', id: 5836 },
        { name: '将翱将翔', id: 9170 },
        { name: '弋凫与雁', id: 51658 },
        { name: '弋言加之', id: 4416 },
        { name: '与子宜之', id: 69 },
        { name: '宜言饮酒', id: 51918 },
        { name: '与子偕老', id: 52751 },
        { name: '琴瑟在御', id: 11157 },
        { name: '莫不静好', id: 56022 },
      ];
      return () => ({
        title: '好风如水',
        rowKey: 'id',
        limit: 6,
        batchActions: table => [
          {
            name: '全选',
            onClick: () => table.selectAll(),
          },
          {
            name: '反选',
            onClick: () => table.toggleAll(),
          },
          {
            name: '取消全选',
            onClick: () => table.unselectAll(),
          },
          {
            name: '清空',
            onClick: () => table.clear(),
          },
        ],
        async request(params) {
          const {
            pagination: { page, pageSize },
          } = params;

          return {
            list: list.slice((page - 1) * pageSize, pageSize * page),
            total: list.length,
          };
        },

        selectable(item) {
          return item.id % 10 !== 9;
        },
        onChange(payload) {
          console.log(payload.values);
        },
        columns: [
          column({
            prop: 'name',
            label: '名称',
          }),
          column({
            prop: 'id',
            label: 'id',
          }),
        ],
      });
    });

    return () => {
      return (
        <div>
          <ElButton
            onClick={() => {
              multiple.value = !multiple.value;
            }}
          >
            切换选择状态
          </ElButton>

          {multiple.value ? <Table key="s"></Table> : <Table key="m" multiple></Table>}
        </div>
      );
    };
  },
});
