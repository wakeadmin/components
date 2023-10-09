import { defineFatForm, providerI18nContentOptions, FatI18nInput, FatI18nTextarea } from '@wakeadmin/components';
import { ElMessageBox } from 'element-plus';
import { delay } from '@wakeadmin/utils';

export default defineFatForm(({ item, form, consumer, group }) => {
  const i18nContent = providerI18nContentOptions(
    {
      sourceLanguage: async () => {
        // 获取源语言
        await delay(1000);
        return 'zh';
      },
      async get(uuid) {
        // 获取已配置的语言宝
        await delay(1000);

        return [
          {
            code: 'en',
            content: 'hello world',
          },
        ];
      },
      async save(uuid, changed, list) {
        // 保存
        console.log('saving', uuid, changed, list);
      },
    },
    true
  );

  // 返回表单定义
  return () => ({
    submit: async values => {
      // 保存多语言
      await i18nContent.flush();
      console.log('保存成功', values);
    },

    children: [
      item({
        prop: 'name',
        label: '账号名',
        width: 'medium',
      }),
      item({
        prop: 'nickName',
        label: '昵称',
        width: 'medium',
        valueProps: {
          customInput: FatI18nInput,
          showWordLimit: true,
          maxlength: 100,
        },
      }),
      item({
        prop: 'note',
        label: '备注',
        valueType: 'textarea',
        width: 'medium',
        valueProps: {
          customInput: FatI18nTextarea,
          showWordLimit: true,
          maxlength: 100,
        },
      }),

      consumer(({ values }) => {
        return group({
          label: '表单状态',
          children: (
            <pre>
              <code>{JSON.stringify(values, null, 2)}</code>
            </pre>
          ),
        });
      }),
    ],
  });
});
