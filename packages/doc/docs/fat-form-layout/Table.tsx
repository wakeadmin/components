import { defineFatForm, FatFormMode } from '@wakeadmin/components';
import { ElSwitch } from 'element-plus';
import { ref } from 'vue';

export default defineFatForm(({ item, table, tableColumn, consumer, group }) => {
  const previewMode = ref<FatFormMode>('editable');

  const handleModeChange = (preview: any) => {
    if (preview) {
      previewMode.value = 'preview';
    } else {
      previewMode.value = 'editable';
    }
  };

  return () => ({
    mode: previewMode.value,
    children: [
      consumer(() => {
        return (
          <div>
            预览模式：
            <ElSwitch modelValue={previewMode.value === 'preview'} onUpdate:modelValue={handleModeChange} />
          </div>
        );
      }),
      item({ label: '标题', prop: 'title', width: 'small' }),
      table({
        prop: 'list',
        label: '详情',
        width: 700,
        // list 数组本身的验证规则
        required: true,
        columns: [
          tableColumn({
            prop: 'name',
            label: '姓名',
            width: 'mini',
            // 表单项级别的验证规则
            required: true,
          }),
          tableColumn({
            prop: 'address',
            label: '地址',
            valueType: 'textarea',
            valueProps: {
              maxlength: 100,
              showWordLimit: true,
            },
            required: true,
          }),
          tableColumn({ prop: 'enabled', label: '状态', valueType: 'switch', width: 'mini' }),
          tableColumn({
            prop: 'action',
            label: '当前行数据',
            // 复杂场景，自定义表单
            renderColumn({ form, parentProp }) {
              return <pre>{JSON.stringify(form.getFieldValue(parentProp), undefined, 2)}</pre>;
            },
          }),
        ],
        // 自定义文案
        createText: '新增一行',
        removeText: '删除',
      }),
      consumer(form =>
        group({
          label: '当前值',
          children: (
            <pre>
              <code>{JSON.stringify(form.values, null, 2)}</code>
            </pre>
          ),
        })
      ),
    ],
  });
});
