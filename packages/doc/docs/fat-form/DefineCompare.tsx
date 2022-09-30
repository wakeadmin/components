import { defineFatForm } from '@wakeadmin/components';

export const UseConsumer = defineFatForm(({ item, consumer }) => {
  return () => ({
    children: [
      item({ label: 'a', prop: 'a' }),
      item({ label: 'b', prop: 'b' }),
      item({ label: 'c', prop: 'c' }),
      consumer(({ values }) => {
        return <div>{JSON.stringify(values)}</div>;
      }),
    ],
  });
});

/**
 * 未使用 consumer, 将导致全量渲染
 */
export const NotUseConsumer = defineFatForm(({ item, form }) => {
  return () => ({
    children: [
      item({ label: 'a', prop: 'a' }),
      item({ label: 'b', prop: 'b' }),
      item({ label: 'c', prop: 'c' }),
      <div>{JSON.stringify(form.value?.values)}</div>,
    ],
  });
});
