<template>
  <FatDropListGroup class="drop-group">
    <FatDropList class="list drop-item" :data="dataSource1">
      <FatDragItem
        v-for="item of dataSource1"
        :key="item"
        class="inline-block w-300"
        :data="item"
        @dropped="dropListGroupDropHandler"
      >
        <span> {{ item }} </span>
      </FatDragItem>
    </FatDropList>
    <FatDropList class="list drop-item" :data="dataSource2">
      <FatDragItem
        v-for="item of dataSource2"
        :key="item"
        class="inline-block w-300"
        :data="item"
        @dropped="dropListGroupDropHandler"
      >
        <span> {{ item }} </span>
      </FatDragItem>
    </FatDropList>
  </FatDropListGroup>
</template>
<script setup lang="ts">
  import {
    FatDragItem,
    FatDropList,
    FatDropListGroup,
    moveItemInRefArray,
    transferArrayItem,
    type FatDragItemEventPayload,
  } from '@wakeadmin/components';
  import { ref } from 'vue';

  const dataSource1 = ref([
    '町、時の流れ、人',
    'nostalgia',
    'Dearly Beloved',
    '蒼崎青子',
    '谁が为に',
    'Sorrow',
    "Dead's dream",
  ]);
  const dataSource2 = ref([
    'グーラ領/森林',
    'ザナルカンドにて',
    'The Final Battle',
    'Blood Upon the Snow',
    'Old Soldiers Die Hard',
    'Lost Again',
    'I Really Want to Stay At Your House',
  ]);
  const dropListGroupDropHandler = (event: FatDragItemEventPayload['dropped']) => {
    const { container, previousContainer, previousIndex, currentIndex } = event;
    if (container !== previousContainer) {
      transferArrayItem(previousContainer!.data, container!.data, previousIndex, currentIndex);
    } else {
      moveItemInRefArray(container!.data as any, previousIndex, currentIndex);
    }
  };
</script>
<style lang="scss" scoped>
  .inline-block {
    display: inline-block;
    background: #fff;
    padding: 6px 12px;
    box-sizing: border-box;
    cursor: move;
  }
  .w-300 {
    width: 300px;
  }
  .list {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin-top: 12px;
    & + & {
      margin-left: 10vw;
    }
    &.row {
      flex-direction: row;

      .inline-block + .inline-block {
        border: 1px solid #ccc;
        border-left: none;
      }
    }
    .inline-block {
      border: 1px solid #ccc;
    }
    .inline-block + .inline-block {
      border-top: none;
    }
  }

  .drop-group {
    display: flex;
  }
  .drop-item {
    margin-bottom: 3vw;
  }
</style>
