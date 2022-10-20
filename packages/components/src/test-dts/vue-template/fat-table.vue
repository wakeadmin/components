<template>
  <div>
    <FatTable
      :request="request"
      :columns="[]"
      @load="(value) => expectLoadParams(value)"
      >
      <template #error="scope">{{expectType<FatTableMethods<any, any>>(scope)}}</template>
    </FatTable>
  </div>
</template>

<script lang="tsx" setup>
  // eslint-disable-next-line no-unused-vars
  import {FatTable, FatTableMethods} from '../../fat-table'

  import { expectType } from '..';

  // eslint-disable-next-line no-empty-function
  const expectLoadParams = (value: {foo: number}[]) => {}

  const request = async() => {
    return {
      list: [{foo: 1}], total: 1
    }
  }
</script>
