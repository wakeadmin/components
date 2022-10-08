export function describe(_name: string, _fn: () => void): void;
export function test(_name: string, _fn: () => any): void;

export function expectType<T>(value: T): void;
export function expectError<T>(value: T): void;
export function expectAssignable<T, T2 extends T = T>(value: T2): void;

export type MayBeUndefined<T> = T | undefined;

export const noop: any;
