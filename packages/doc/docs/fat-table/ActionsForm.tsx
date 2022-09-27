import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm(({ item }) => {
  return () => ({
    layout: 'inline',
    enableSubmitter: false,
    syncToInitialValues: true,
    children: [
      item({
        prop: 'disableDelete',
        valueType: 'checkbox',
        valueProps: {
          label: '禁止删除?',
        },
      }),
      item({
        prop: 'editable',
        valueType: 'checkbox',
        valueProps: {
          label: '可编辑?',
        },
      }),
    ],
  });
});
