<template>
  <div>
    <FatDropList :data="dataSource1" class="list" @dropped="move($event)">
      <FatDragItem v-for="item of dataSource1" :key="item.name" class="inline-block w-300" :data="item">
        <span> {{ item.name }} </span>
      </FatDragItem>
      <template #preview="{ cover }">
        <picture class="cover">
          <img :src="cover" />
        </picture>
      </template>
    </FatDropList>
  </div>
</template>
<script setup lang="ts">
  import { FatDragItem, FatDropList, moveItemInRefArray, type FatDragItemEventPayload } from '@wakeadmin/components';
  import { ref } from 'vue';

  import img1 from './images/1.jpg';
  import img2 from './images/2.jpg';
  import img3 from './images/3.jpg';
  import img4 from './images/4.jpg';
  import img5 from './images/5.jpg';
  import img6 from './images/6.jpg';

  const dataSource1 = ref([
    {
      name: 'Rain',
      cover: img1,
    },
    {
      name: '月 ~Main Theme',
      cover: img2,
    },
    {
      name: 'It through all eternity',
      cover: img3,
    },
    {
      name: '真紅の翼',
      cover: img4,
    },
    {
      name: '王都アウルリウム',
      cover: img5,
    },
    {
      name: '久遠寺有珠',
      cover: img6,
    },
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

<!-- eslint-disable-next-line wkvue/no-style-scoped -->
<style lang="scss">
  .cover {
    display: inline-block;
    width: 130px;
    height: 130px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
</style>
