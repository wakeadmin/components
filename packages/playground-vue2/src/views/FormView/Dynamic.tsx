import { defineFatForm } from '@wakeadmin/components';

export default defineFatForm<{ list: { name: string; id: number }[] }>(
  ({ form, consumer, item, group, renderChild }) => {
    let uid = 0;
    const initialValue = {
      title: '',
      list: [],
    };

    const handleAdd = () => {
      form.value?.values.list.push({ name: '', id: uid++ });
    };

    const handleRemove = (id: number) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const list = form.value!.values.list;

      const idx = list.findIndex(i => i.id === id);

      if (idx !== -1) {
        list.splice(idx, 1);
      }
    };

    return () => {
      return {
        initialValue,
        children: [
          renderChild(item({ label: '名称', prop: 'title' })),
          consumer(f => {
            return group({
              label: '列表',
              vertical: true,
              gutter: 0,
              children: f.values.list.map((i, idx) =>
                item({
                  // 只有在动态渲染列表时才需要id， 大部分情况不需要
                  key: i.id,
                  prop: `list[${idx}].name`,
                  width: 'medium',
                  rules: { required: true },
                  renderDefault: () => (
                    <button type="button" onClick={() => handleRemove(i.id)}>
                      删除
                    </button>
                  ),
                })
              ),
            });
          }),
          <div>
            <button type="button" onClick={handleAdd}>
              新增一行
            </button>
          </div>,
          consumer(f => {
            return <span>{JSON.stringify(f.values)}</span>;
          }),
        ],
      };
    };
  }
);
