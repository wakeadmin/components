<template>
  <FatFormQuery label-width="unset">
    <FatFormItem prop="search" value-type="search" label="请输入关键字" />
    <FatFormItem
      prop="status"
      value-type="select"
      :value-props="{
        options: [
          { label: '已开启', value: 1 },
          { label: '未开启', value: 0 },
        ],
      }"
      label="状态"
    />
  </FatFormQuery>
</template>

<script setup lang="tsx">
  import { FatFormQuery, FatFormItem } from '@wakeadmin/components';
</script>
