import { computed, unref, Ref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { inheritProps, mergeProps, pickEnumerable } from '../utils';

import { FatTable } from './fat-table';
import { useFatTableRef } from './hooks';
import { FatTableMethods, FatTableProps } from './types';

/**
 * 定义表格组件
 * @template T 行记录类型
 * @template S 查询参数类型
 * @params definitions 可以指定定义 fat-table 参数，或者使用类似 setup 的语法
 *
 * @example
 *
 * ```html
 * <template>
 *   <MyTable />
 *   <MyAnotherTable />
 * </template>
 *
 * <script lang="tsx" setup>
 *   const MyTable = defineFatTable({})
 *   // or
 *
 *   const MyTable = defineFatTable(() => {
 *     const someState = ref(0)
 *     return () => ({
 *       class: {active: someState},
 *       // ....
 *     })
 *   })
 * </script>
 * ```
 *
 * @returns 返回一个 table 组件
 */
export function defineFatTable<T extends {}, S extends {}>(
  definitions:
    | FatTableProps<T, S>
    | ((instanceRef: Ref<FatTableMethods<T, S> | undefined>) => () => FatTableProps<T, S>)
): (props: Partial<FatTableProps<T, S>>) => any {
  return declareComponent({
    name: 'PreDefinedFatTable',
    setup(_props, ctx) {
      const tableRef = useFatTableRef<T, S>();
      const extraDefinitions = typeof definitions === 'function' ? computed(definitions(tableRef)) : definitions;

      return () => {
        const preDefineProps = unref(extraDefinitions);

        return (
          // @ts-expect-error
          <FatTable
            ref={tableRef}
            // events && attrs passthrough
            {...mergeProps(preDefineProps, inheritProps(false))}
            // slots passthrough
            v-slots={pickEnumerable(ctx.slots)}
          />
        );
      };
    },
  }) as any;
}
