import { CommonProps } from '@wakeadmin/element-adapter';
import { computed, unref, Ref } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';

import { forwardExpose, inheritProps, mergeProps, pickEnumerable } from '../utils';
import { FatTablePublicMethodKeys } from './constants';

import { FatTable } from './fat-table';
import { useFatTableRef } from './hooks';
import { FatTableMethods, FatTableProps } from './types';

export type FatTableDefine<Item extends {}, Query extends {}> =
  | (FatTableProps<Item, Query> & CommonProps)
  | ((instanceRef: Ref<FatTableMethods<Item, Query> | undefined>) => () => FatTableProps<Item, Query> & CommonProps);

/**
 * 定义表格组件
 * @template Item 行记录类型
 * @template Query 查询参数类型
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
export function defineFatTable<Item extends {}, Query extends {}>(
  definitions: FatTableDefine<Item, Query>
): (props: Partial<FatTableProps<Item, Query>>) => any {
  return declareComponent({
    name: 'PreDefinedFatTable',
    setup(_props, { slots, expose }) {
      const tableRef = useFatTableRef<Item, Query>();
      const extraDefinitions = typeof definitions === 'function' ? computed(definitions(tableRef)) : definitions;

      const instance = {};

      forwardExpose(instance, FatTablePublicMethodKeys, tableRef);

      expose(instance);

      return () => {
        const preDefineProps = unref(extraDefinitions);

        return (
          // @ts-expect-error
          <FatTable
            ref={tableRef}
            // events && attrs passthrough
            {...mergeProps(preDefineProps, inheritProps(false))}
            // slots passthrough
            v-slots={pickEnumerable(slots)}
          />
        );
      };
    },
  }) as any;
}
