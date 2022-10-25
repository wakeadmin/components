import { defineFatFormSteps } from '@wakeadmin/components';

export default defineFatFormSteps(({ step, item }) => {
  return () => ({
    formWidth: '550px',
    strict: false,
    children: [
      step({
        title: '步骤1',
        children: [
          item({
            prop: 'a',
            label: 'a',
            required: true,
          }),
          item({
            prop: 'b',
            label: 'b',
            required: true,
          }),
          item({
            prop: 'c',
            label: 'c',
            required: true,
          }),
        ],
      }),
      step({
        title: '步骤2',
        children: [
          item({
            prop: 'd',
            label: 'd',
            required: true,
          }),
          item({
            prop: 'e',
            label: 'e',
            required: true,
          }),
          item({
            prop: 'f',
            label: 'f',
            required: true,
          }),
        ],
      }),
    ],
  });
});
