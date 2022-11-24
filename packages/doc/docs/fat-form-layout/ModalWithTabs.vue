<template>
  <div>
    <CreateOrEditModal ref="modalRef" />

    <div>
      <ul>
        <li v-for="item of list" :key="item.id">
          {{ item.name }}: {{ item.sex === 0 ? '男' : '女' }}
          <el-button @click="handleEdit(item)">编辑</el-button>
        </li>
      </ul>
    </div>

    <div>
      <el-button @click="handleCreate">新建</el-button>
    </div>
  </div>
</template>

<script lang="tsx" setup>
  import { defineFatFormModal, defineFatFormTabs, useFatFormModalRef } from '@wakeadmin/components';
  import { ElMessage } from 'element-plus';
  import { reactive } from 'vue';

  interface Data {
    /**
     * 编辑时存在
     */
    id?: number;
    name: string;
    sex: number;
  }

  const modalRef = useFatFormModalRef<Data>();
  const list = reactive<Data[]>([]);

  const handleCreate = () => {
    modalRef.value?.open({
      title: '新建',
      initialValue: { name: '', sex: 0 },
    });
  };

  const handleEdit = (item: Data) => {
    modalRef.value?.open({
      title: '编辑',
      initialValue: item,
    });
  };

  const MyTabsForm = defineFatFormTabs<Data>(({ item, tabPane }) => {
    return () => ({
      async submit(values) {
        // 在这里调用保存接口
        if (values.id) {
          // 编辑
          const idx = list.findIndex(i => i.id === values.id);
          list[idx] = values;
        } else {
          // 新建
          list.push({ id: Date.now(), ...values });
        }
      },
      onFinish(values) {
        // 保存成功，可以在这里进行列表刷新之类的操作
        ElMessage.success('保存成功');
      },
      children: [
        tabPane({
          name: 'first',
          label: '第一个',
          children: [
            item({
              label: '名称',
              prop: 'name',
              required: true,
            }),
          ],
        }),

        tabPane({
          name: 'second',
          label: '第二个',
          children: [
            item({
              prop: 'sex',
              label: '性别',
              valueType: 'select',
              valueProps: {
                options: [
                  { label: '男', value: 0 },
                  { label: '女', value: 1 },
                ],
              },
            }),
          ],
        }),
      ],
    });
  });

  const CreateOrEditModal = defineFatFormModal<Data>(() => {
    return () => ({ Form: MyTabsForm, class: 'my-modal-form' });
  });
</script>

<!-- eslint-disable-next-line wkvue/no-style-scoped -->
<style>
  .my-modal-form .el-dialog__body {
    padding-top: 0px;
  }
</style>
