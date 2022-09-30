import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm<{
  // 🔴 这里的泛型变量可以定义表单数据结构
  name: string;
  nickName: string;
}>(({ item, form, consumer, group }) => {
  // 🔴 这里可以放置 Hooks

  // 🔴 form 为 FatForm 实例引用
  console.log(form);

  // 返回表单定义
  return () => ({
    // FatForm props 定义
    initialValue: {
      name: 'ivan',
      nickName: '狗蛋',
    },

    // 🔴 子节点
    children: [
      item({ prop: 'name', label: '账号名' }),
      item({
        prop: 'nickName',
        label: '昵称',
      }),

      // 🔴 这里甚至可以放 JSX
      <div>JSX hello</div>,

      // 🔴 不过，如果你想要监听 表单数据，还是建议使用 FatFormConsumer, 否则会导致整个表单的重新渲染
      // 不信，你可以打开 Vue 开发者工具的 Highlight Updates 试一下
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
