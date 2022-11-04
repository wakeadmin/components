import { defineFatForm } from '@wakeadmin/components';
import { ElButton } from 'element-plus';

export default defineFatForm(({ item, group, renderChild }) => {
  return () => ({
    style: { maxWidth: '500px', margin: '0 auto' },
    children: [
      item({ prop: 'id', label: '身份证', width: 'large', required: true }),
      item({ prop: 'address', label: '地址', width: 'large' }),
      item({ prop: 'note', label: '备注', width: 'huge', valueType: 'textarea' }),
    ],
    renderSubmitter(form) {
      return renderChild(
        group({
          labelWidth: 'auto',
          children: [form.renderButtons(), <ElButton>自定义按钮</ElButton>],
        })
      );
    },
  });
});
