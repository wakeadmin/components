import { expectType, test } from '.';
import { defineFatTable, FatTableMethods } from '../fat-table';

test('defineFatTable', () => {
  interface T {
    foo: number;
  }

  const Result = defineFatTable<T>(({ column }) => () => ({
    async request() {
      return { total: 0, list: [] };
    },
    columns: [
      column({
        valueType: 'date',
        valueProps: {
          format: 'YYYY-MM-DD',
          // @ts-expect-error align 类型错误
          align: 'error',
        },
      }),
      column({
        valueType: 'date',
        // @ts-expect-error align 类型错误
        valueProps: (row, index) => {
          expectType<T | undefined>(row);
          expectType<number | undefined>(index);

          return {
            format: 'YYYY-MM-DD',
            align: 'error',
          };
        },
      }),
    ],
  }));

  <Result
    onLoad={v => {
      expectType<T[]>(v);
    }}
    v-slots={{
      empty: table => {
        expectType<FatTableMethods<T, {}>>(table);
      },
    }}
  />;
});
