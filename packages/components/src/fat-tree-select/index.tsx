/**
 * 移植
 */
import { TreeSelect, TreeSelectProps, TreeNode, TreeSelectMethods, TreeData } from '@wakeadmin/element-adapter';
import { ref } from '@wakeadmin/demi';

import { OurComponentInstance, PickOnEvent } from '../utils';

export interface FatTreeSelectSlots<K = string | number, D extends TreeData = TreeData> {
  renderDefault?: (scope: { node: TreeNode<K, D>; data: D }) => any;
  renderPrefix?: () => any;
  renderEmpty?: () => any;
}

export type FatTreeSelectMethods<K = string | number, D extends TreeData = TreeData> = TreeSelectMethods<K, D>;

export type FatTreeSelectProps<K = string | number, D extends TreeData = TreeData> = TreeSelectProps<K, D>;

export type FatTreeSelectEvents<K = string | number, D extends TreeData = TreeData> = PickOnEvent<
  FatTreeSelectProps<K, D>
>;

export function useFatTreeSelectRef<K = string | number, D extends TreeData = TreeData>() {
  return ref<FatTreeSelectMethods<K, D>>();
}

export const FatTreeSelect = TreeSelect as unknown as new <K = string | number, D extends TreeData = TreeData>(
  props: FatTreeSelectProps<K, D>
) => OurComponentInstance<
  typeof props,
  FatTreeSelectSlots<K, D>,
  FatTreeSelectEvents<K, D>,
  FatTreeSelectMethods<K, D>
>;
