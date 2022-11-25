<template>
  <TreeSelect
    v-slot="scope"
    v-model="selected"
    clearable
    lazy
    multiple
    check-strictly
    show-checkbox
    :props="props"
    :load="load"
    @blur="handleBlur"
    @check="handleCheck"
    @node-click="handleNodeClick"
  >
    xx {{ scope.node.label }}
  </TreeSelect>
</template>

<script setup>
  import { TreeSelect } from '@wakeadmin/element-adapter';
  import { ref } from 'vue';

  const handleBlur = () => {
    console.log('blur');
  };

  const handleCheck = () => {
    console.log('check');
  };

  const handleNodeClick = () => {
    console.log('node-click');
  };

  // eslint-disable-next-line no-unused-vars
  const _data = [
    {
      label: '一级 1',
      value: 1,
      children: [
        {
          label: '二级 1-1',
          value: 11,
          children: [
            {
              label: '三级 1-1-1',
              value: 111,
            },
          ],
        },
      ],
    },
    {
      label: '一级 2',
      value: 2,
      disabled: true,
      children: [
        {
          label: '二级 2-1',
          value: 21,
          children: [
            {
              label: '三级 2-1-1',
              value: 211,
            },
          ],
        },
        {
          label: '二级 2-2',
          value: 22,
          children: [
            {
              label: '三级 2-2-1',
              value: 221,
            },
          ],
        },
      ],
    },
    {
      label: '一级 3',
      value: 3,
      children: [
        {
          label: '二级 3-1',
          value: 31,
          children: [
            {
              label: '三级 3-1-1',
              value: 311,
              children: [
                {
                  label: '四级 3-1-1-1',
                  value: 3111,
                  children: [
                    {
                      label: '五级 -------- 3-1-1-1-1',
                      value: 31111,
                    },
                    {
                      label: '五级 --------- 3-1-1-1-2',
                      value: 31112,
                    },
                  ],
                },
                {
                  label: '四级 3-1-1-2',
                  value: 3112,
                },
              ],
            },
          ],
        },
        {
          label: '二级 3-2',
          value: 32,
          children: [
            {
              label: '三级 3-2-1',
              value: 321,
            },
          ],
        },
      ],
    },
  ];

  const selected = ref([7, 8]);

  const props = {
    label: 'label',
    children: 'children',
    isLeaf: 'isLeaf',
  };

  let id = 0;

  const load = (node, resolve) => {
    if (node.isLeaf) {
      return resolve([]);
    }

    setTimeout(() => {
      resolve([
        {
          value: ++id,
          label: `lazy load node${id}`,
        },
        {
          value: ++id,
          label: `lazy load node${id}`,
          isLeaf: true,
        },
      ]);
    }, 400);
  };
</script>
