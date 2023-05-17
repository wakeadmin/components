<template>
  <div>
    <Selector ref="selectorRef" />
    <ElButton @click="handleSelect">选择</ElButton>
  </div>
</template>

<script setup lang="tsx">
  import { ElButton, ElSwitch } from 'element-plus';
  import { defineFatTableSelectModal, useFatTableSelectModalRef } from '@wakeadmin/components';

  interface Item {
    id: string;
    name: string;
  }

  const selectorRef = useFatTableSelectModalRef();

  const handleSelect = async () => {
    selectorRef.value?.open({});
  };

  const Selector = defineFatTableSelectModal<Item, { name: string }, { id: string }, {}>(({ column, modalRef }) => {
    return () => {
      return {
        rowKey: 'id',
        title: '选择器',
        async request() {
          return {
            total: 2,
            list: [
              { id: '1', name: '1' },
              { id: '2', name: '2' },
              { id: '3', name: '3' },
            ],
          };
        },
        selectable(row) {
          return row.id !== '1';
        },
        // 🔴 关闭默认操作列
        showActions: false,
        // 🔴 关闭选中后关闭弹窗
        confirmOnSelected: false,
        columns: [
          // 🔴 自定义选择列
          column({
            label: '选择',
            render(value, row, index) {
              return (
                <ElSwitch
                  modelValue={modalRef.value?.isSelected(row)}
                  onUpdate:modelValue={v => {
                    modalRef.value?.select(row);
                  }}
                  disabled={!modalRef.value?.selectable(row)}
                ></ElSwitch>
              );
            },
          }),
          column({
            prop: 'name',
            label: '名称',
          }),
        ],
      };
    };
  });
</script>
