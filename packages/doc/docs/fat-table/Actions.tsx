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
      return { list: [{ id: 0 }], total: 1 };
    },
    renderAfterForm() {
      return <ActionsForm initialValue={initialValue} />;
    },
    enablePagination: false,
    rowKey: 'id',
    async remove(list) {
      // 在这里进行表格删除数据请求
    },
    columns: [
      {
        type: 'actions',
        label: '操作',
        // 支持传入一个函数，常用于一些需要动态计算的场景
        actions: () => {
          return [
            {
              name: '标题',
              title: '提示信息',
            },
            {
              name: '危险',
              type: 'danger',
            },
            {
              name: '警告',
              type: 'warning',
              confirm: '可以设置确认信息',
              onClick: () => {
                console.log('点击了警告操作');
              },
            },
            {
              name: '删除',
              type: 'danger',
              // 禁用
              disabled: initialValue.disableDelete,
              // FatTable 内置了删除功能
              onClick: (table, row) => {
                table.remove(row);
              },
            },
            {
              name: '编辑',
              // 支持 vue router
              visible: initialValue.editable,
              link: { name: 'someRoute', query: { id: 'someId' } },
            },
          ];
        },
      },
      {
        type: 'actions',
        label: '按钮操作',
        actionsType: 'button',
        actions: () => {
          return [{ name: '快乐' }, { name: '星球' }];
        },
      },
      {
        type: 'actions',
        label: '无操作',
        actions: [],
      },
    ],
  });
});
