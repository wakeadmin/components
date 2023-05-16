<template>
  <div>
    <MyTableModal ref="tableModalRef"></MyTableModal>
    <el-button @click="open">打开</el-button>
  </div>
</template>

<script lang="tsx" setup>
  import { defineFatTableModal, useFatTableModalRef } from '@wakeadmin/components';

  const tableModalRef = useFatTableModalRef();

  const MyTableModal = defineFatTableModal<{ id: string; name: string; date: Date }, { name?: string }>(() => {
    return () => ({
      style: 'color: red',
      async request(params) {
        console.log('request', params);

        const {
          pagination: { pageSize, page },
        } = params;

        return {
          total: 100,
          list: new Array(pageSize).fill(0).map((_, index) => {
            return {
              id: `${page}_${index}`,
              name: `name_${page}_${index}`,
              date: new Date(Date.now() + index * 2000),
            };
          }),
        };
      },
      enableQuery: true,
      columns: [
        {
          prop: 'name',
          label: '名称',
          queryable: true,
          valueProps: {
            placeholder: '名称',
          },
        },
        {
          label: '日期',
          prop: 'date',
        },
      ],
      renderBeforeForm() {
        return 'before form';
      },
      onCellDblclick() {
        console.log('cell dbclick');
      },
    });
  });

  const open = () => {
    tableModalRef.value!.open({
      title: '浮槎来',
    });
  };
</script>
