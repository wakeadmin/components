<template>
  <FatSpace>
    <FatIcon color="primary">
      <Add />
    </FatIcon>
    <FatIcon color="danger">
      <Delete />
    </FatIcon>
    <FatIcon loading>
      <Refresh />
    </FatIcon>
    <FatIcon size="3em">
      <HomeFill />
    </FatIcon>
  </FatSpace>
</template>

<script lang="tsx" setup>
  import { FatIcon, FatSpace } from '@wakeadmin/components';
  import { Add, Refresh, Delete, HomeFill } from '@wakeadmin/icons';
</script>
