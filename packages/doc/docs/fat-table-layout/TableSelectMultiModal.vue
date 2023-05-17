<template>
  <div>
    <Selector ref="selectorRef" />
    <ElButton @click="handleSelect">选择</ElButton>
  </div>
</template>

<script setup lang="ts">
  import { ElButton } from 'element-plus';
  import { defineFatTableSelectModal, useFatTableSelectModalRef } from '@wakeadmin/components';

  interface Item {
    id: string;
    name: string;
  }

  const selectorRef = useFatTableSelectModalRef();

  const handleSelect = async () => {
    selectorRef.value?.open({});
  };

  const Selector = defineFatTableSelectModal<Item, { name: string }, { id: string }, {}>(({ column }) => {
    return () => {
      return {
        rowKey: 'id',
        title: '选择器',
        multiple: true,
        limit: 5,
        async request() {
          return {
            total: 10,
            list: new Array(10).fill(0).map((i, idx) => {
              return {
                id: idx + '',
                name: idx + '',
              };
            }),
          };
        },
        columns: [
          column({
            prop: 'name',
            label: '名称',
          }),
        ],
      };
    };
  });
</script>
