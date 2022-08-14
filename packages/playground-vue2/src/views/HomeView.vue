<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <FatTable :request="request" :columns="columns" />
  </div>
</template>

<script lang="ts" setup>
  import { FatTable } from '@wakeadmin/components';

  const request = async params => {
    const {
      pagination: { pageSize },
    } = params;
    return {
      total: 100,
      list: new Array(pageSize).fill(0).map((_, index) => {
        return {
          id: index,
          name: `name_${index}`,
        };
      }),
    };
  };

  const columns = [
    {
      prop: 'name',
      label: 'Name',
    },
  ];
</script>
