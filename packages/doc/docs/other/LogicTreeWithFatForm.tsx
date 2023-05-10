import { defineComponent, ref } from 'vue';
import { defineFatForm, FatFormItem, FatLogicTree, LogicType } from '@wakeadmin/components';
import { ElButton } from 'element-plus';
import s from './LogicTreeOperation.module.scss';

interface Group {
  id: string | number;
  category: 'group';
  type?: LogicType;
  children: Item[];
}
interface Node {
  category: 'node';
  id: string | number;
  value: string;
}

type Item = Group | Node;

export default defineFatForm(({ group, consumer }) => {
  return () => ({
    submit: async value => {
      console.log('保存', value);
    },
    onValidateFailed: errors => {
      console.log('验证失败', errors);
    },
    children: [
      group({
        label: '逻辑分组',
        prop: 'logic',
        initialValue: {
          category: 'group',
          id: 'root',
          type: LogicType.OR,
          children: [],
        },
        rules: {
          validator(rule, value, callback) {
            if (value == null || !(value as Group).children?.length) {
              callback(new Error('请至少添加一个分组'));
            } else {
              callback();
            }
          },
        },
        children: [
          consumer(formScope => {
            return (
              <FatLogicTree<Item>
                basePath="logic"
                modelValue={formScope.getFieldValue('logic')}
                onUpdate:modelValue={v => formScope.setFieldValue('logic', v)}
                // 自定义分组渲染
                // 用于复杂的样式定义
                renderGroup={scope => {
                  const current = scope.current as Group;

                  if (scope.depth === 0) {
                    // 根节点
                    return (
                      <div class={s.root}>
                        {current.children.length === 0 && <div class={s.empty}>这里啥都没有</div>}
                        {scope.vdom}
                        <ElButton
                          class={s.button}
                          onClick={() => {
                            scope.append({
                              category: 'group',
                              id: 'group-' + current.children.length,
                              type: LogicType.AND,
                              children: [
                                {
                                  category: 'node',
                                  id: 'node',
                                  value: 'Example',
                                },
                              ],
                            });
                          }}
                        >
                          添加分组
                        </ElButton>
                      </div>
                    );
                  }

                  return (
                    <div class={s.group}>
                      <h3>分组: {scope.index + 1}</h3>
                      <div class={s.subGroup}>{scope.vdom}</div>
                    </div>
                  );
                }}
                // 自定义节点渲染
                renderNode={scope => {
                  const current = scope.current as Node;

                  // 插入子节点
                  const handleAddChild = () => {
                    const id = Date.now();
                    scope.insertAfter({
                      category: 'node',
                      id,
                      value: `Example ${id}`,
                    });
                  };

                  return (
                    <div class={s.node}>
                      <FatFormItem
                        prop={scope.path + '.value'}
                        rules={{ required: true, message: '不能为空' }}
                      ></FatFormItem>
                      <div>
                        {scope.index === 0 && <ElButton onClick={handleAddChild}>添加</ElButton>}
                        <ElButton onClick={scope.remove}>删除</ElButton>
                      </div>
                    </div>
                  );
                }}
              ></FatLogicTree>
            );
          }),
        ],
      }),
      group({
        label: '数据',
        children: [
          consumer(scope => {
            return (
              <pre>
                <code>{JSON.stringify(scope.values, undefined, 2)}</code>
              </pre>
            );
          }),
        ],
      }),
    ],
  });
});
