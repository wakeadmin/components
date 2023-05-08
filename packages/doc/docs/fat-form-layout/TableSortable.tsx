import { FatFormTableSortType, defineFatForm } from '@wakeadmin/components';
import { ElIcon, ElTableColumn } from 'element-plus';
import { Rank } from '@element-plus/icons-vue';

import s from './TableSortable.module.scss';

export default defineFatForm(({ item, table, tableColumn, consumer, group }) => {
  // 第三行之后的可以排序
  const sortable = (index: number) => {
    return index >= 3;
  };

  return () => ({
    children: [
      table({
        prop: 'list',
        width: 700,
        createText: '点击这里添加一行, 第四行后才能排序',
        // 🔴 使用 columns 插槽自定义表格列
        // 🔴 自定义拖拽具备，配合 sortableProps 的 handle 属性使用
        renderColumns: ins => {
          return [
            <ElTableColumn
              label="序号"
              width={80}
              v-slots={{
                default: (scope: { $index: number }) => {
                  return (
                    <div class={s.dragHandle}>
                      {scope.$index + 1}
                      {sortable(scope.$index) && (
                        <ElIcon>
                          <Rank></Rank>
                        </ElIcon>
                      )}
                    </div>
                  );
                },
              }}
            ></ElTableColumn>,
          ];
        },
        columns: [
          tableColumn({
            prop: 'name',
            label: '姓名',
            // 表单项级别的验证规则
            required: true,
          }),
          tableColumn({ prop: 'enabled', label: '状态', valueType: 'switch', width: 'mini' }),
        ],
        // 🔴 开启排序
        sortable: true,
        sortableProps: {
          /**
           * 🔴 拖拽排序
           */
          type: FatFormTableSortType.ByDrag,

          /**
           * 🔴 拖动手柄，默认是整行可以拖动
           */
          handle: `.${s.dragHandle}`,

          /**
           * 🔴 判断是否支持拖动
           * @param params
           * @returns
           */
          rowSortable(params) {
            return sortable(params.index);
          },

          /**
           * 🔴 自定义复杂的功能
           * 比如这里不能拖动到前三行
           */
          canDrop(params) {
            return params.relatedIndex >= 3;
          },
        },
      }),
      consumer(form =>
        group({
          children: (
            <pre>
              <code>{JSON.stringify(form.values, null, 2)}</code>
            </pre>
          ),
        })
      ),
    ],
  });
});
