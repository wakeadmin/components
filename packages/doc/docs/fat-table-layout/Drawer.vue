<template>
  <div>
    <MyTableDrawer ref="tableModalRef"></MyTableDrawer>
    <el-button @click="open">打开</el-button>
  </div>
</template>

<script lang="tsx" setup>
  import { defineFatTableDrawer, useFatTableDrawerRef } from '@wakeadmin/components';

  const tableModalRef = useFatTableDrawerRef();

  const MyTableDrawer = defineFatTableDrawer<{ id: string; name: string; date: Date }, { name?: string }>(() => {
    return () => ({
      size: 800,
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
    });
  });

  const open = () => {
    tableModalRef.value!.open({
      title: '浮槎来',
    });
  };
</script>
