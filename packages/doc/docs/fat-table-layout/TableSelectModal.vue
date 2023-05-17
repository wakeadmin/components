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
    selectorRef.value?.open({
      onChange(v) {
        alert('选中: ' + v.values[0].name);
      },
    });
  };

  const Selector = defineFatTableSelectModal<Item, { name: string }, { id: string }, {}>(({ column }) => {
    return () => {
      return {
        rowKey: 'id',
        title: '选择器',
        renderFooter() {
          return null;
        },
        onOpen() {
          console.log('onOpen');
        },
        onClose() {
          console.log('onClose');
        },
        async request() {
          return {
            total: 2,
            list: [
              { id: '1', name: '1' },
              { id: '2', name: '2' },
            ],
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
