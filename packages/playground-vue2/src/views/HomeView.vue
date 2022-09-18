<template>
  <div class="home">
    <FatTable
      ref="tableRef"
      row-key="id"
      :request="request"
      :remove="remove"
      :columns="columns"
      :request-on-removed="false"
      confirm-before-remove="hello"
      message-on-removed="fuck"
      :enable-select="true"
      row-class-name="fuck"
      :batch-actions="[{ name: '删除已选', confirm: '确认删除?' }]"
      @row-click="handleClick"
      @queryCacheRestore="handleCacheRestore"
    >
      <template #title>标题</template>
      <template #navBar><el-button type="primary">新建</el-button></template>
      <template #toolbar>
        <el-button @click="selectAll">select all</el-button>
        <el-button @click="unselectAll">unselect all</el-button>
        <el-button @click="getSelected">getSelected</el-button>
        <el-button @click="removeSelected">remove selected</el-button>
      </template>
      <template #bottomToolbar>
        <el-button>导入</el-button>
        <el-button>导出</el-button>
      </template>
      <template #beforeSubmit> hello </template>
      <template #formTrailing> hello </template>
    </FatTable>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { FatTable } from '@wakeadmin/components';
  import { delay } from '@wakeapp/utils';

  const handleCacheRestore = cache => {
    console.log('cache', cache);
  };

  const handleClick = () => {
    console.log('click');
  };

  const tableRef = ref();

  const remove = () => {
    return Promise.resolve();
  };

  const request = async params => {
    console.log('request', params);
    const {
      pagination: { pageSize, page },
    } = params;

    await delay(1000);

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
  };

  const columns = [
    {
      type: 'query',
      renderLabel: () => '关键字',
      tooltip: '很重要',
      prop: 'query',
      initialValue: 'x',
      valueProps: {
        placeholder: '关键字',
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      type: 'query',
      label: '值',
      renderFormItem: (q: any) => {
        return <span>{JSON.stringify(q)}</span>;
      },
    },
    {
      prop: 'name',
      label: 'Name',
      queryable: true,
      initialValue: 'hello',
      valueProps: {
        placeholder: '评论',
      },
    },
    {
      prop: 'age',
      label: 'Age',
      sortable: 'ascending',
    },
    {
      prop: 'date',
      label: '时间',
      valueType: 'date-range',
      valueProps: {
        valueFormat: 'YYYY-MM-DD',
      },
      initialValue: ['2022-03-13', '2022-03-17'],
      transform: v => {
        if (Array.isArray(v)) {
          return { startTime: v[0], endTime: v[1] };
        }
      },
      queryable: true,
    },
    {
      prop: 'filter',
      label: 'filter',
      filterable: [
        { text: 'one', value: 1 },
        { text: 'two', value: 2 },
      ],
      filteredValue: [1, 2],
    },
    {
      prop: 'filter2',
      label: 'filter2',
      filterable: [
        { text: 'one', value: 1 },
        { text: 'two', value: 2 },
      ],
      filteredValue: [1],
    },
    {
      type: 'actions',
      label: '操作',
      width: 260,
      labelAlign: 'center',
      actions: [
        { name: 'Hello', onClick: () => console.log('Hello'), title: 'hello title' },
        {
          name: 'World',
          type: 'warning',
          confirm: ({ row }) => ({ message: `${JSON.stringify(row)}` }),
        },
        {
          name: 'delete',
          type: 'danger',
          onClick: (t, row) => {
            t.remove(row);
          },
        },
        { name: 'Bar', disabled: true },
        { name: 'Foo', disabled: true },
        { name: 'Baz', visible: false },
        { name: 'Bazz', title: 'hello title' },
      ],
    },
  ];

  const selectAll = () => {
    tableRef.value?.selectAll();
  };

  const unselectAll = () => {
    tableRef.value?.unselectAll();
  };

  const getSelected = () => {
    console.log(tableRef.value?.getSelected());
  };

  const removeSelected = () => {
    tableRef.value?.removeSelected();
  };
</script>

<style lang="scss" scoped>
  .home {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
