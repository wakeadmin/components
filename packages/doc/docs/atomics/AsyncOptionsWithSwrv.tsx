import { defineFatForm } from '@wakeadmin/components';
import { ref } from 'vue';
import useSwrv from 'swrv';
import { ElButton } from 'element-plus';

export default defineFatForm(({ item, group }) => {
  const callTime = ref(0);
  let uuid = 0;
  const { data, mutate: reload } = useSwrv('/your/api', () => {
    callTime.value++;
    return Promise.resolve([
      {
        label: `选项1 ${uuid++}`,
        value: 1,
      },
      {
        label: `选项2 ${uuid++}`,
        value: 2,
      },
    ]);
  });

  return () => ({
    children: [
      item({
        prop: 'option1',
        label: '选项1',
        valueType: 'select',
        initialValue: 1,
        valueProps: {
          options: data.value,
        },
      }),
      item({
        prop: 'option2',
        label: '选项1',
        valueType: 'select',
        initialValue: 2,
        valueProps: {
          options: data.value,
        },
      }),
      group({
        label: '刷新',
        children: [<ElButton onClick={() => reload()}>reload: {callTime.value}</ElButton>],
      }),
    ],
  });
});
