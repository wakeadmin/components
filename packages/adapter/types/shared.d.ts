export type Size = 'small' | 'default' | 'large';

export function size(s: Size): string;
export function model<T>(value: T, onChange: (value: T) => void): any;

export const vLoading: any;
