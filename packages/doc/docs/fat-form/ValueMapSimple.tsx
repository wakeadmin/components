import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm<{ json?: string }>(({ item, consumer }) => {
  return () => ({
    children: [
      item({
        label: 'JSON',
        valueType: 'multi-select',
        prop: 'json',
        valueProps: {
          options: [
            { label: '1', value: 1 },
            { label: '2', value: 2 },
          ],
        },
        valueMap: {
          in: value => {
            if (!value) {
              return [];
            }
            try {
              return JSON.parse(value as string);
            } catch (e) {
              return [];
            }
          },
          out: value => {
            if (!value) {
              return '';
            }
            return JSON.stringify(value);
          },
        },
      }),
      consumer(scope => {
        return <pre>{JSON.stringify(scope.values, null, 2)}</pre>;
      }),
    ],
  });
});
