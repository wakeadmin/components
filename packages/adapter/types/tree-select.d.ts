import { TreeProps, TreeMethods, TreeData } from './tree';
import { SelectProps, SelectMethods } from './select';

export interface TreeSelectData extends TreeData {
  value: any;
  children?: TreeSelectData[];
}

export interface TreeSelectProps<K, D extends TreeSelectData> extends TreeProps<K, D>, SelectProps {}

export interface TreeSelectMethods<K, D extends TreeSelectData> extends TreeMethods<K, D>, SelectMethods {}

export const TreeSelect: <K = string | number, D extends TreeSelectData = TreeSelectData>(
  props: TreeSelectProps<K, D>
) => any;
