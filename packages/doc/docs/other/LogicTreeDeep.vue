<template>
  <FatLogicTree v-model="data">
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
  import { FatLogicTree, LogicType } from '@wakeadmin/components';

  type Item =
    | {
        id: string | number;
        category: 'group';
        type?: LogicType;
        children: Item[];
      }
    | {
        category: 'node';
        id: string | number;
        value: string;
      };

  const data = ref<Item>({
    id: 'root',
    category: 'group',
    type: LogicType.OR,
    children: [
      {
        category: 'node',
        id: 1,
        value: 'Item 1',
      },
      {
        id: 2,
        category: 'node',
        value: 'Item 2',
      },
      {
        id: 3,
        category: 'group',
        children: [
          {
            id: 31,
            category: 'node',
            value: 'Item 3-1',
          },
          {
            id: 32,
            category: 'node',
            value: 'Item 3-2',
          },
        ],
      },
      {
        id: 4,
        category: 'group',
        children: [
          {
            id: 41,
            value: 'Item 4-1',
            category: 'node',
          },
          {
            id: 42,
            value: 'Item 4-2',
            category: 'node',
          },
        ],
      },
      {
        id: 5,
        category: 'group',
        type: LogicType.OR,
        children: [],
      },
      {
        id: 6,
        type: LogicType.OR,
        category: 'group',
        children: [
          {
            id: 61,
            category: 'group',
            children: [
              {
                id: 611,
                category: 'group',
                children: [
                  {
                    id: 6111,
                    value: 'Item 6-1-1-1',
                    category: 'node',
                  },
                  {
                    id: 6112,
                    category: 'group',
                    type: LogicType.OR,
                    children: [
                      {
                        id: 61121,
                        category: 'group',
                        type: LogicType.OR,
                        children: [
                          {
                            id: 611211,
                            value: 'Item 6-1-1-2-1-1',
                            category: 'node',
                          },
                          {
                            id: 611212,
                            value: 'Item 6-1-1-2-1-2',
                            category: 'node',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                id: 612,
                value: 'Item 6-1-2',
                category: 'node',
              },
            ],
          },
          {
            id: 62,
            value: 'Item 6-2',
            category: 'node',
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
