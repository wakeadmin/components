<template>
  <div>
    <FatDropList :data="dataSource1" class="list row" orientation="horizontal" @dropped="move($event)">
      <FatDragItem v-for="item of dataSource1" :key="item" class="inline-block w-100" :data="item">
        <span> {{ item }} </span>
      </FatDragItem>
    </FatDropList>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem, FatDropList, moveItemInRefArray, type FatDragItemEventPayload } from '@wakeadmin/components';
  import { ref } from 'vue';

  const dataSource1 = ref(['明月如霜', '好风如水', '清景无限', '曲港跳鱼']);
  const move = (obj: FatDragItemEventPayload['dropped']) => {
    moveItemInRefArray(dataSource1, obj.previousIndex, obj.currentIndex);
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
  .w-100 {
    width: 100px;
  }
  .list {
    display: flex;
    flex-direction: column;
    width: max-content;
    margin-left: 10vw;
    margin-top: 12px;
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
</style>
