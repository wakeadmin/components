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
      :request-on-query-change="false"
      :enable-select="true"
      row-class-name="fuck"
      :initial-query="initialQuery"
      @row-click="handleClick"
      @query-cache-restore="handleCacheRestore"
    />
    <button @click="selectAll">select all</button>
    <button @click="unselectAll">unselect all</button>
    <button @click="getSelected">getSelected</button>
    <button @click="removeSelected">remove selected</button>
  </div>
</template>

<script lang="tsx" setup>
  import { ref } from 'vue';
  import { FatTable } from '@wakeadmin/components';
  import { ElFormItem, ElInput, ElCol } from 'element-plus';

  const handleClick = () => {
    console.log('click');
  };

  const handleCacheRestore = cache => {
    console.log('cache', cache);
  };

  const tableRef = ref();

  const remove = () => {
    return Promise.resolve();
  };

  const initialQuery = {
    query: 'initial',
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
          date: new Date(Date.now() + index * 2000),
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
      tooltip: 'hello',
      valueType: 'input',
      queryable: true,
      initialValue: 'hello',
      valueProps: {
        placeholder: '评论',
        onFocus: () => {
          console.log('focus', document.hasFocus(), document.getSelection().focusNode);
        },
        onBlur: () => {
          console.log('blur', document.hasFocus(), document.getSelection().focusNode);
        },
        onChange: v => {
          console.log('name change', v);
        },
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
      order: 5,
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
      type: 'query',
      initialValue: { foo: 'bar', bar: 'baz' },
      renderFormItem: query => {
        return (
          <ElFormItem label="hello">
            <ElCol span={12}>
              <ElInput modelValue={query.foo} onUpdate:modelValue={v => (query.foo = v)} />
            </ElCol>
            <ElCol span={12}>
              <ElInput modelValue={query.bar} onUpdate:modelValue={v => (query.bar = v)} />
            </ElCol>
          </ElFormItem>
        );
      },
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
