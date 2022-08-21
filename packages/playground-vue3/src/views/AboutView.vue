<template>
  <div class="about">
    <h1>This is an about page</h1>
    <MyTable class="my-table" row-key="id" @cell-click="handleCellClick">
      <template #afterForm>after form</template>
    </MyTable>
  </div>
</template>

<script lang="tsx" setup>
  import { defineFatTable } from '@wakeadmin/components';

  const handleCellClick = () => {
    console.log('cell click');
  };

  const MyTable = defineFatTable<{ id: string; name: string; date: Date }, { name?: string }>({
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
        queryable: true,
        valueType: 'input',
        valueProps: {
          placeholder: '名称',
        },
      },
      {
        prop: 'date',
      },
    ],
    renderBeforeForm() {
      return <div>before form</div>;
    },
    onCellDblclick() {
      console.log('cell dbclick');
    },
  });
</script>
