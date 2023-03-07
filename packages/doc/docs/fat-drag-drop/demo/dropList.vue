<template>
  <div>
    <FatDropList :data="dataSource1" class="list" @dropped="move($event)">
      <FatDragItem v-for="item of dataSource1" :key="item" class="inline-block w-300" :data="item">
        <span> {{ item }} </span>
      </FatDragItem>
    </FatDropList>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem, FatDropList, moveItemInRefArray, type FatDragItemEventPayload } from '@wakeadmin/components';
  import { ref } from 'vue';

  const dataSource1 = ref([
    '蘅皋向晚舣轻航',
    '卸云帆、水驿鱼乡',
    '当暮天、霁色如晴昼',
    '江练静、皎月飞光',
    '那堪听、远村羌管，引离人断肠',
    '此际浪萍风梗，度岁茫茫',
    '堪伤',
    '朝欢暮宴，被多情、赋与凄凉',
    '别来最苦，襟袖依约，尚有馀香',
    '算得伊、鸳衾凤枕，夜永争不思量',
    '牵情处，惟有临歧，一句难忘',
  ]);
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
  .w-300 {
    width: 300px;
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
