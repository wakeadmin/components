import { inject, ref } from '@wakeadmin/demi';
import memoize from 'lodash/memoize';

import { normalizeKeyPath } from '../utils';

import { FatFormContext, FatFormInheritanceContext } from './constants';
import { FatFormMethods } from './types';

/**
 * fat-form 实例引用
 * @returns
 */
export function useFatFormRef<S extends {}>() {
  return ref<FatFormMethods<S>>();
}

export function useFatFormContext() {
  return inject(FatFormContext, null);
}

export function useInheritableProps() {
  return inject(FatFormInheritanceContext);
}

export function useTouches() {
  let touched: Record<string, boolean> = {};
  const np = memoize(normalizeKeyPath);

  const touch = (prop: string) => {
    touched[np(prop)] = true;
  };

  const isTouched = (prop: string) => {
    return !!touched[np(prop)];
  };

  const clear = () => {
    touched = {};
  };

  const getAllTouches = () => {
    return Object.keys(touched);
  };

  return {
    touch,
    isTouched,
    clear,
    getAllTouches,
  };
}
