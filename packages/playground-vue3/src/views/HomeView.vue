<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <FatTable ref="tableRef" :request="request" :columns="columns" :enable-select="true" />
    <button @click="selectAll">select all</button>
    <button @click="unselectAll">unselect all</button>
    <button @click="getSelected">getSelected</button>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { FatTable } from '@wakeadmin/components';

  const tableRef = ref();

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
      prop: 'name',
      label: 'Name',
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
</script>
