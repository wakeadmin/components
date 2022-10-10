import { Ref } from '@wakeadmin/demi';

export type Size = 'small' | 'default' | 'large';

export function size(s?: Size): string;

/**
 * @deprecated use useVModel
 * @param value
 * @param onChange
 */
export function model<T>(value: T, onChange: (value: T) => void): any;

export function useVModel<T>(props: { value?: T; onChange?: (value: T) => void }): Ref<any>;

export const vLoading: any;

export type VNodeChildAtom = JSX.Element | string | number | boolean | null | undefined | void;

export type VNodeArrayChildren = (VNodeArrayChildren | VNodeChildAtom)[];

export type VNodeChild = VNodeChildAtom | VNodeArrayChildren;
