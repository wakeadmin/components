<template>
  <div class="home">
    <el-button @click="attach"> attach </el-button>
    <FatSwitch v-model="active"></FatSwitch>
    <FatSwitch
      v-model="active"
      active-color="red"
      inactive-color="blue"
      active-text="ok"
      inactive-text="off"
    ></FatSwitch>
    <FatSwitch v-model="active" active-text="ok" inactive-text="off" inline-prompt></FatSwitch>
    <FatSwitch v-model="active" active-text="开启" inactive-text="另外三个字" inline-prompt></FatSwitch>
    <FatSwitch v-model="active" active-text="ok" inactive-text="off" inline-prompt loading></FatSwitch>
    <FatSwitch v-model="active" size="small"></FatSwitch>
    <FatSwitch v-model="active" inline-prompt active-text="开启" inactive-text="另外三个字" size="small"></FatSwitch>
    <FatSwitch
      v-model="active"
      active-color="red"
      inactive-color="blue"
      active-text="ok"
      inactive-text="off"
      size="small"
    ></FatSwitch>

    <FatTableSelect
      v-if="active"
      ref="tableRef"
      v-model="selected"
      multiple
      enable-cache-query
      row-key="id"
      :request="request"
      :remove="remove"
      :columns="columns"
      :request-on-removed="false"
      confirm-before-remove="hello"
      message-on-removed="fuck"
      row-class-name="fuck"
      :batch-actions="batchActions"
      :height="600"
      :limit="3"
      :disabled="disabledFn"
      :select-action-text="text"
      @row-click="handleClick"
      @queryCacheRestore="handleCacheRestore"
      @select="log"
      @select-all="log"
    >
      <template #beforeTable><span>before table</span></template>
      <template #afterTable><span>before table</span></template>
      <template #title>标题</template>
      <template #navBar><el-button type="primary">新建</el-button></template>
      <template #toolbar>
        <el-button @click="selectAll">select all</el-button>
        <el-button @click="unselectAll">unselect all</el-button>
        <el-button @click="getSelected">getSelected</el-button>
        <el-button @click="removeSelected">remove selected</el-button>
      </template>
      <template #bottomToolbar>
        <el-button>导入</el-button>
        <el-button>导出</el-button>
      </template>
      <template #beforeSubmit> hello </template>
      <template #formTrailing> after </template>
      <template #afterSubmit> after buttons </template>
    </FatTableSelect>
  </div>
</template>

<script lang="jsx" setup>
  import { ref, watch, getCurrentInstance, provide } from 'vue';
  import { FatTableSelect, FatSwitch, Portal } from '@wakeadmin/components';
  import { delay } from '@wakeapp/utils';
  import Child from './child.vue';

  provide('S', 'SSS');
  const log = (...args) => console.log(...args);

  const active = ref(true);

  const text = <i>S</i>;

  const selected = ref([{ id: '1_0', name: '123' }]);

  watch(selected, v => console.log(v));

  const handleCacheRestore = cache => {
    console.log('cache', cache);
  };

  const handleClick = () => {
    console.log('click');
  };

  const tableRef = ref();

  const batchActions = [
    {
      name: '删除已选',
      confirm: '确认删除?',
      onClick: async table => {
        table.removeSelected();
        await delay(3e3);
      },
    },
    {
      name: '反选全部',
      onClick: async table => {
        table.toggle(...new Array(10).fill('_').map((_, i) => `1_${i}`));
      },
    },
  ];
  const disabledFn = (item, status) => {
    return !!(parseInt(item.id.split('_')[1]) & 2);
  };

  const remove = () => {
    throw new Error('123');
    // return Promise.resolve();
  };

  const request = async params => {
    console.log('request', params);
    const {
      pagination: { pageSize, page },
    } = params;

    await delay(1e2);
    return {
      total: 100,
      list: new Array(pageSize).fill(0).map((_, index) => {
        return {
          id: `${page}_${index}`,
          name: `name_${page}_${index}`,
          date: new Date(Date.now() + index * 2000),
          status: index % 2,
        };
      }),
    };
  };

  const columns = [
    {
      type: 'query',
      renderLabel: () => '关键字',
      tooltip: '很重要',
      prop: 'query',
      initialValue: 'x',
      valueProps: {
        placeholder: '关键字',
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      type: 'query',
      label: '值',
      renderFormItem: q => {
        return <span>{JSON.stringify(q)}</span>;
      },
    },
    {
      type: 'query',
      prop: 'phone',
      label: '手机号',
      formItemProps: {
        filter: /\d+/,
      },
    },
    {
      label: '用户信息',
      minWidth: 60,
      getter() {
        return {
          avatar: 'https://test-material-1259575047.cos.ap-guangzhou.myqcloud.com/4b93eb5d5cc7472cbe4ce5149d1c73fe.jpg',
          title: <span style={{ color: '#f0f' }}>Sakura</span>,
          description: '13212341234',
        };
      },
      valueType: 'avatar',
      valueProps: {
        placement: 'left',
        shape: 'square',
        size: '56px',
      },
    },
    {
      prop: 'status',
      label: '状态',
      queryable: true,
      valueType: 'select',
      valueProps: {
        options: async () => {
          console.log('request status');
          return [
            {
              label: '开启',
              value: 1,
            },
            {
              label: '禁用',
              value: 0,
            },
          ];
        },
      },
    },
    {
      prop: 'status',
      label: '状态切换',
      valueType: 'switch',
      valueProps: row => ({
        mode: 'editable',
        activeValue: 1,
        inactiveValue: 0,
        async beforeChange() {
          await delay(3e3);
          return true;
        },
        async onChange() {
          // FIXME: 这里不应该在初始化时触发 switch
          console.log('switch change', row);
        },
      }),
    },
    {
      prop: 'name',
      label: 'Name',
      queryable: true,
      initialValue: 'hello',
      valueProps: {
        placeholder: '评论',
      },
    },
    {
      prop: 'age',
      label: 'Age',
      sortable: 'ascending',
    },
    {
      prop: 'date',
      label: '时间',
      valueType: 'date-range',
      valueProps: {
        valueFormat: 'YYYY-MM-DD',
      },
      initialValue: ['2022-03-13', '2022-03-17'],
      transform: v => {
        if (Array.isArray(v)) {
          return { startTime: v[0], endTime: v[1] };
        }
      },
      queryable: true,
    },
    {
      prop: 'filter',
      label: 'filter',
      filterable: [
        { text: 'one', value: 1 },
        { text: 'two', value: 2 },
      ],
      filteredValue: [1, 2],
    },
    {
      prop: 'filter2',
      label: 'filter2',
      filterable: [
        { text: 'one', value: 1 },
        { text: 'two', value: 2 },
      ],
      filteredValue: [1],
    },
    // {
    //   type: 'actions',
    //   label: '操作',
    //   minWidth: 130,
    //   labelAlign: 'center',
    //   align: 'center',
    //   actions: [
    //     { name: 'Hello', onClick: () => console.log('Hello'), title: 'hello title', disabled: true },
    //     {
    //       name: 'World',
    //       type: 'warning',
    //       title: '????',
    //       confirm: ({ row }) => ({ message: `${JSON.stringify(row)}` }),
    //       onClick: () => delay(3e3),
    //     },
    //     {
    //       name: 'delete',
    //       type: 'danger',
    //       onClick: (t, row) => {
    //         t.remove(row);
    //       },
    //     },
    //     { name: 'Bar', disabled: true },
    //     {
    //       name: 'Foo',
    //       disabled: true,
    //       title: 'hello title',
    //       onClick: () => {
    //         console.log('foo click');
    //       },
    //     },
    //     { name: 'Baz', visible: false },
    //     {
    //       name: 'Bazz',
    //       title: 'hello title',
    //       onClick: () => {
    //         console.log('bazz click');
    //       },
    //     },
    //   ],
    // },
  ];

  const selectAll = () => {
    tableRef.value?.selectAll();
  };

  const unselectAll = () => {
    tableRef.value?.unselectAll();
  };

  const getSelected = () => {
    console.log(tableRef.value?.getSelected());
  };

  const removeSelected = () => {
    tableRef.value?.removeSelected();
  };

  const context = getCurrentInstance().proxy;

  defineExpose({
    remove: removeSelected,
  });

  console.log(context);

  const attach = () => {
    const instance = new Portal(() => <Child></Child>, {
      context,
    });
    instance.attach();
    instance.instance.open();
    setTimeout(() => {
      instance.detach();
    }, 1e3);
  };
</script>

<style lang="scss" scoped>
  .home {
    background-color: #f5f7fa;
    min-height: 100vh;
    padding: 20px;
    box-sizing: border-box;
  }
</style>
