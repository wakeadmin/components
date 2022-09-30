<template>
  <div>
    <CreateOrEditModal ref="modalRef" />

    <div>
      <ul>
        <li v-for="item of list" :key="item.id">
          {{ item.name }}: {{ item.sex }}
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
  import { defineFatFormModal, useFatFormModalRef } from '@wakeadmin/components';
  import { ElMessage } from 'element-plus';
  import { reactive } from 'vue';

  interface Data {
    /**
     * 编辑时存在
     */
    id?: number;
    name: string;
    sex: string;
  }

  const modalRef = useFatFormModalRef();
  const list = reactive<Data[]>([]);

  const CreateOrEditModal = defineFatFormModal<Data>(({ item }) => {
    return () => ({
      async submit() {
        // 在这里调用保存接口
      },
      onFinish(values) {
        // 保存成功，可以在这里进行列表刷新之类的操作
        ElMessage.success('保存成功');
      },
      children: [
        item({
          label: '名称',
          prop: 'name',
        }),
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
    });
  });
</script>
