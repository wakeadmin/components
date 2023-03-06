import { defineFatForm } from '@wakeadmin/components';
import { Switch } from 'element-ui';
import { ref } from 'vue';

export default defineFatForm<{ foo: string; bar: string }>(({ item, consumer, group }) => {
  const previewMode = ref(false);

  return () => ({
    mode: previewMode.value ? 'preview' : 'editable',
    class: ['hello', 'world'],
    onLoad() {
      console.log('load on define');
    },
    async request() {
      return {
        foo: 'foo',
        bar: 'bar',
        baz: [{ a: 1 }, { b: 2 }],
      };
    },
    children: [
      <div>
        {previewMode.value ? '预览模式' : '编辑模式'}:{' '}
        <Switch value={previewMode.value} onInput={(e: boolean) => (previewMode.value = e)} />
      </div>,
      item({ label: 'Foo', prop: 'foo', width: 'medium' }),
      item({ label: 'Bar', prop: 'bar', width: 'medium' }),
      group({
        label: 'Group',
        width: 'huge',
        maxWidth: 'large',
        children: [
          item({ prop: 'baz[0].a', valueType: 'integer', valueProps: { placeholder: 'hello' }, width: 'medium' }),
          <span>中间</span>,
          item({
            prop: 'baz[1].b',
            valueType: 'integer',
            valueProps: { placeholder: 'world' },
            message: '很重要',
            width: 'medium',
          }),
        ],
      }),
      consumer(form => form.values.foo === 'foo' && item({ prop: 'unknown', initialValue: 'hello' })),
      consumer(form => {
        return (
          <div>
            <button>hi</button>
            {JSON.stringify(form.values)}
          </div>
        );
      }),
    ],
  });
});
