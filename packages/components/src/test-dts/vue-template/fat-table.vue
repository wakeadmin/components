<template>
  <div>
    <FatTable
      :request="async (params) => { expectType<FatTableRequestParams<any, any>>(params); return {list: [], total: 0}}"
      :columns="[]">
      <template #error="scope">{{expectType<FatTableMethods<any, any>>(scope)}}</template>
    </FatTable>
  </div>
</template>

<script lang="tsx" setup>
  // eslint-disable-next-line no-unused-vars
  import {FatTable, FatTableRequestParams, FatTableMethods} from '../../fat-table'

  import { expectType } from '..';
</script>
