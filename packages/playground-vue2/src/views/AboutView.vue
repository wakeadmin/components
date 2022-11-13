<template>
  <div class="about">
    <h1>This is an about page</h1>
    <Button @click="open">open</Button>
    <MyTable ref="tableRef" class="my-table" row-key="id" @cell-click="handleCellClick">
      <template #afterForm>after form</template>
    </MyTable>
    <MyTableModal ref="tableModalRef"></MyTableModal>
    <MyTableSelect></MyTableSelect>
  </div>
</template>

<script lang="tsx" setup>
  import {
    defineFatTable,
    defineFatTableModal,
    useFatTableModalRef,
    useFatTableRef,
    defineFatTableSelect,
  } from '@wakeadmin/components';
  import { Button } from 'element-ui';

  const handleCellClick = () => {
    console.log('cell click');
  };
  const tableModalRef = useFatTableModalRef();

  const tableRef = useFatTableRef();

  const MyTable = defineFatTable<{ id: string; name: string; date: Date }, { name?: string }>(() => {
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
          queryable: true,
          valueProps: {
            placeholder: '名称',
          },
        },
        {
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
          queryable: true,
          valueProps: {
            placeholder: '名称',
          },
        },
        {
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
      title: '标题',
    });
  };

  const columns = [
    {
      label: '用户信息',
      minWidth: 60,
      getter() {
        return {
          avatar: 'https://test-material-1259575047.cos.ap-guangzhou.myqcloud.com/4b93eb5d5cc7472cbe4ce5149d1c73fe.jpg',
          title: <span style={{ color: '#f0f' }}>Sakura</span>,
          description: '13212341234',
        };
      },
      valueType: 'avatar',
      valueProps: {
        placement: 'left',
        shape: 'square',
        size: '56px',
      },
    },
    {
      prop: 'status',
      label: '状态',
      queryable: true,
      valueType: 'select',
      valueProps: {
        options: async () => {
          console.log('request status');
          return [
            {
              label: '开启',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ];
        },
      },
    },
    {
      prop: 'status',
      label: '状态切换',
      valueType: 'switch',
      valueProps: (row: any) => ({
        mode: 'editable',
        activeValue: 1,
        inactiveValue: 0,
        async beforeChange() {
          return true;
        },
        async onChange() {
          // FIXME: 这里不应该在初始化时触发 switch
          console.log('switch change', row);
        },
      }),
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
  ];
  const MyTableSelect = defineFatTableSelect(() => () => ({
    multiple: true,
    async request(params: any) {
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
    rowKey: 'name',
    enableQuery: true,
    columns,
  }));
</script>
