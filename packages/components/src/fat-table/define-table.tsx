import { computed, unref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { inheritProps, pickEnumerable } from '../utils';

import { FatTable } from './fat-table';
import { FatTableProps } from './types';

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
  definitions: FatTableProps<T, S> | (() => () => FatTableProps<T, S>)
): (props: Partial<FatTableProps<T, S>>) => any {
  return declareComponent({
    name: 'PreDefinedFatTable',
    setup(_props, ctx) {
      const extraDefinitions = typeof definitions === 'function' ? computed(definitions()) : definitions;

      return () => {
        const preDefineProps = unref(extraDefinitions);

        return (
          <FatTable
            {...preDefineProps}
            // events && attrs passthrough
            {...inheritProps(false)}
            // slots passthrough
            v-slots={pickEnumerable(ctx.slots)}
          />
        );
      };
    },
  }) as any;
}
