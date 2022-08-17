<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <FatTable
      ref="tableRef"
      row-key="id"
      :request="request"
      :remove="remove"
      :columns="columns"
      :request-on-removed="false"
      :enable-select="true"
    />
    <button @click="selectAll">select all</button>
    <button @click="unselectAll">unselect all</button>
    <button @click="getSelected">getSelected</button>
    <button @click="removeSelected">remove selected</button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FatTable } from '@wakeadmin/components';

  const tableRef = ref();

  const remove = () => {
    return Promise.resolve();
  };

  const request = async params => {
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
        };
      }),
    };
  };

  const columns = [
    {
      type: 'query',
      renderLabel: () => '关键字',
      prop: 'query',
      valueType: 'input',
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
      prop: 'name',
      label: 'Name',
      valueType: 'input',
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
      filteredValue: [1, 2],
    },
    {
      type: 'actions',
      label: '操作',
      width: 260,
      labelAlign: 'center',
      actions: [
        { name: 'Hello', onClick: () => console.log('Hello'), type: 'danger' },
        { name: 'World', type: 'warning' },
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
