import { TreeProps, TreeMethods, TreeData } from './tree';
import { SelectProps, SelectMethods } from './select';

export interface TreeSelectProps<K, D extends TreeData> extends TreeProps<K, D>, SelectProps {}

export interface TreeSelectMethods<K, D extends TreeData> extends TreeMethods<K, D>, SelectMethods {}

export const TreeSelect: <K = string | number, D extends TreeData = TreeData>(props: TreeSelectProps<K, D>) => any;
