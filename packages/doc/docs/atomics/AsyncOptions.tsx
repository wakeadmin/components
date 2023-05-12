import { defineFatForm } from '@wakeadmin/components';
import { ref } from 'vue';

export default defineFatForm(({ item, group }) => {
  const callTime = ref(0);

  const getList = () => {
    callTime.value++;

    return Promise.resolve([
      {
        label: '选项1',
        value: 1,
      },
      {
        label: '选项2',
        value: 2,
      },
    ]);
  };

  return () => ({
    children: [
      item({
        prop: 'option1',
        label: '选项1',
        valueType: 'select',
        initialValue: 1,
        valueProps: {
          options: getList,
        },
      }),
      item({
        prop: 'option2',
        label: '选项1',
        valueType: 'select',
        initialValue: 2,
        valueProps: {
          options: getList,
        },
      }),
      group({
        label: '调用次数',
        children: [<span>{callTime.value}</span>],
      }),
    ],
  });
});
