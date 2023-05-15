import { watchPostEffect } from 'vue';
import { defineFatForm, FatFormItem, FatLogicTree, LogicType } from '@wakeadmin/components';
import { ElButton } from 'element-plus';
import Sortable from 'sortablejs';
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

export default defineFatForm(({ form, group, consumer }) => {
  // 🔴 使用 Sortablejs 实现拖拽
  watchPostEffect(cleanUp => {
    // 监听一级分组数据变化
    const groups = form.value?.values?.logic?.children;

    if (!groups.length) {
      return;
    }

    const groupsElements = document.querySelectorAll(`.${s.subGroup} > .fat-logic-tree__list > .fat-logic-tree__group`);
    const sortables: Sortable[] = [];

    for (const g of groupsElements) {
      sortables.push(
        new Sortable(g as HTMLElement, {
          group: 'shared',
          draggable: '.fat-logic-tree__content',
          onEnd(evt) {
            if (evt.from !== evt.to) {
              // 分组之间拖拽
              evt.item.remove();
              const fromGroupIndex = parseInt(evt.from.parentElement?.parentElement?.dataset.index as string, 10);
              const toGroupIndex = parseInt(evt.to.parentElement?.parentElement?.dataset.index as string, 10);
              const fromGroup = groups[fromGroupIndex];
              const toGroup = groups[toGroupIndex];

              const item = fromGroup.children.splice(evt.oldIndex, 1)[0];
              toGroup.children.splice(evt.newIndex, 0, item);

              if (!fromGroup.children.length) {
                // 清空
                groups.splice(fromGroupIndex, 1);
              }
            } else {
              // 同一个分组排序
              const groupIndex = parseInt(evt.from.parentElement?.parentElement?.dataset.index as string, 10);
              const list = groups[groupIndex];

              const item = list.children.splice(evt.oldIndex, 1)[0];
              list.children.splice(evt.newIndex, 0, item);
            }
          },
        })
      );
    }

    cleanUp(() => {
      sortables.forEach(i => i.destroy());
    });
  });

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
                    <div class={s.group} ref_for>
                      <h3>分组: {scope.index + 1}</h3>
                      <div
                        class={s.subGroup}
                        // 🔴 标记分组索引
                        data-index={scope.index}
                      >
                        {scope.vdom}
                      </div>
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
