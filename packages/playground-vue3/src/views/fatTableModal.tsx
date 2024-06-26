import { defineFatTableModal, useFatTableModalRef } from '@wakeadmin/components';
import { ElButton } from 'element-plus';
import { defineComponent } from 'vue';

const TableModal =  defineFatTableModal(({ column, props, modelRef }) => {
  return () => {
    return {
      // FIXME 未生效
      width: '1400px',
      renderToolbar() {
        return <span>Toolbar</span>;
      },
      async request(params) {
        return { list: [], total: 0 };
      },
      columns: [
        column({
          label: '任务名称',
          prop: 'name',
        }),
        column({
          label: '创建时间',
          prop: 'createTime',
          valueType: 'date',
          valueProps: {
            type: 'datetime',
            valueFormat: 'YYYY-MM-dd HH:mm:ss',
          },
        }),
        column({
          label: '操作人',
          prop: 'createBy',
          width: 140,
        }),
      ],
    };
  };
});


export default defineComponent({
  name: "FatTableModalPage",
  setup(){
    const modal = useFatTableModalRef();

    return () => <div>
      <ElButton onClick={() => modal.value.open()}>open</ElButton>
      <TableModal ref={modal}></TableModal>
    </div>
  }
})