import { FatI18nInput, FatI18nTextarea, defineFatForm } from '@wakeadmin/components';
import { Switch } from 'element-ui';
import { ref } from 'vue';

export default defineFatForm<{ foo: string; bar: string }>(({ item, consumer, group }) => {
  const previewMode = ref(false);

  return () => ({
    mode: previewMode.value ? 'preview' : 'editable',
    class: ['hello', 'world'],
    style: [{ color: 'red' }, 'background: blue'],
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
      item({
        label: '多语言input',
        prop: 'i18nBar',
        width: 'medium',
        valueProps: {
          customInput: FatI18nInput,
        },
      }),
      item({
        label: '多语言textarea',
        prop: 'i18nBar2',
        width: 'medium',
        valueType: 'textarea',
        valueProps: {
          customInput: FatI18nTextarea,
        },
      }),
      item({
        label: '多语言初始值',
        prop: 'i18nBar3',
        width: 'medium',
        initialValue: '__i18n__(hello, 123)',
        valueType: 'textarea',
        valueProps: {
          customInput: FatI18nTextarea,
        },
      }),
      group({
        label: 'Group',
        children: [
          item({ prop: 'baz[0].a', valueType: 'integer', valueProps: { placeholder: 'hello' } }),
          <span>中间</span>,
          item({ prop: 'baz[1].b', valueType: 'integer', valueProps: { placeholder: 'world' }, message: '很重要' }),
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
