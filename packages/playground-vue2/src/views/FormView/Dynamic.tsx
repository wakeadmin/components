import { defineFatForm } from '@wakeadmin/components';
import { ref } from 'vue';

export default defineFatForm<{ list: { name: string; id: number }[] }>(
  ({ form, consumer, item, group, renderChild }) => {
    let uid = 0;

    // 条件表单项
    const conditionItem = ref(false);

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

    const toggleConditionItem = () => {
      conditionItem.value = !conditionItem.value;
    };

    return () => {
      return {
        children: [
          renderChild(item({ label: '名称', prop: 'title', initialValue: 'title' })),
          consumer(f => {
            return group({
              label: '列表',
              vertical: true,
              gutter: 0,
              prop: 'list',
              initialValue: [{ name: 'hello' }],
              rules: [
                {
                  validator(rule, value, callback) {
                    if (value == null || value.length === 0) {
                      callback(new Error('请填写选项组'));
                    } else {
                      callback();
                    }
                  },
                },
              ],
              children: f.values.list?.map((i, idx) =>
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
          // 按需添加的表单项，移除后对应的字段值也会删除
          conditionItem.value && item({ prop: 'condition', preserve: false }),
          consumer(f => {
            return (
              <span>
                {JSON.stringify(f.values)}
                <button type="button" onClick={toggleConditionItem}>
                  {conditionItem.value ? '关闭条件字段' : '开启条件字段'}
                </button>
              </span>
            );
          }),
        ],
      };
    };
  }
);
