import { expectType, test } from '.';
import { defineFatForm } from '../fat-form';

test('defineFatForm', () => {
  interface T {
    foo: number;
  }
  defineFatForm<T>(({ item }) => {
    return () => ({
      children: [
        // @ts-expect-error prop 是必须的，
        item({}),
        item({
          valueProps: {
            // @ts-expect-error 默认推断为 text 类型
            type: 'unknown',
            renderPreview: value => {
              expectType<string | undefined>(value);
              return '';
            },
          },
        }),
      ],
    });
  });
});
