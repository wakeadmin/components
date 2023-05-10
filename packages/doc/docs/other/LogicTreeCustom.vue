<template>
  <FatLogicTree v-model="data" :tree-struct="customTreeStruct" and-text="互斥" or-text="并行">
    <!-- 自定义节点渲染 -->
    <template #node="scope">
      <div class="node">
        <div>VALUE: {{ scope.current.value }}</div>
        <div>INDEX: {{ scope.index }}</div>
        <div>PATH: {{ scope.path }}</div>
        <div>DEPTH: {{ scope.depth }}</div>
      </div>
    </template>
  </FatLogicTree>
</template>

<script setup lang="tsx">
  import { ref } from 'vue';
  import { FatLogicTree, LogicType, FatLogicTreeStruct } from '@wakeadmin/components';

  type Group = {
    uuid: string | number;
    category: 'group';
    logic?: '并行' | '互斥';
    // eslint-disable-next-line no-use-before-define
    list: Item[];
  };

  type Node = {
    category: 'node';
    uuid: string | number;
    value: string;
  };
  type Item = Group | Node;

  // 自定义树结构
  const customTreeStruct: FatLogicTreeStruct<Item> = {
    // 子节点获取
    children: 'list',
    // 唯一标识符获取
    id: 'uuid',
    // 判断是否为逻辑分组
    isGroup: i => i.category === 'group',
    // 获取逻辑类型
    getLogicType: i => ((i as Group).logic === '并行' ? LogicType.OR : LogicType.AND),
    // 写入逻辑类型
    setLogicType: (i, type) => {
      if (i.category === 'group') {
        return {
          ...i,
          logic: type === LogicType.OR ? '并行' : '互斥',
        };
      }

      return i;
    },
  };

  const data = ref<Item>({
    uuid: 'root',
    category: 'group',
    logic: '互斥',
    list: [
      {
        uuid: 1,
        category: 'group',
        logic: '并行',
        list: [
          {
            uuid: 31,
            category: 'node',
            value: 'Item 1',
          },
          {
            uuid: 32,
            category: 'node',
            value: 'Item 2',
          },
        ],
      },
      {
        uuid: 2,
        category: 'group',
        logic: '并行',
        list: [
          {
            uuid: 31,
            category: 'node',
            value: 'Item 1',
          },
          {
            uuid: 32,
            category: 'node',
            value: 'Item 2',
          },
        ],
      },
    ],
  });
</script>

<style scoped>
  .node {
    background-color: white;
    padding: 4px;
    border-radius: 4px;
    margin-bottom: 8px;
    border-radius: 4px;
  }
</style>
