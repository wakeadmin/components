<template>
  <div>
    <Table0 v-model="value0"></Table0>
    <Table1 v-model="value1"></Table1>
    <Table2 v-model="value2"></Table2>
    <Table3 v-model="value3"></Table3>
  </div>
</template>
<script setup lang="ts">
  import { defineFatTableSelect } from '@wakeadmin/components';
  import { ref, effect } from 'vue';

  interface Item {
    name: string;
    id: number;
  }
  type Selection = Partial<Item> | number | string;

  function createTableSelect<T extends Selection>(title: string) {
    return defineFatTableSelect<Item, any, T>({
      title,
      rowKey: 'id',
      limit: 6,
      multiple: true,
      columns: [
        {
          prop: 'name',
          label: '名称',
        },
        {
          prop: 'id',
          label: 'id',
        },
      ],
      async request() {
        return {
          list: [
            { name: '女曰鸡鸣', id: 51024 },
            { name: '士曰昧旦', id: 15629 },
            { name: '子兴视夜', id: 588 },
            { name: '明星有烂', id: 5836 },
            { name: '将翱将翔', id: 9170 },
            { name: '弋凫与雁', id: 51658 },
            { name: '弋言加之', id: 4416 },
            { name: '与子宜之', id: 69 },
            { name: '宜言饮酒', id: 51918 },
            { name: '与子偕老', id: 52751 },
          ],
          total: 10,
        };
      },
    });
  }

  const Table0 = createTableSelect('传入的是undefined');
  const Table1 = createTableSelect<string>('传入的是基本数据类型');
  const Table2 = createTableSelect<{ id: number }>('传入一个单独的id对象');
  const Table3 = createTableSelect<{ id: number; name: string }>('传入其他的对象');

  const value0 = ref([]);
  const value1 = ref([51024]);
  const value2 = ref([{ id: 51024 }]);
  const value3 = ref([{ id: 51024, name: '女曰鸡鸣' }]);

  effect(() => {
    console.log('Table0 ->', value0.value);
  });
  effect(() => {
    console.log('Table1 ->', value1.value);
  });
  effect(() => {
    console.log('Table2 ->', value2.value);
  });
  effect(() => {
    console.log('Table3 ->', value3.value);
  });
</script>
