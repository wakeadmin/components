import { inject, provide, ref } from '@wakeadmin/demi';
import memoize from 'lodash/memoize';

import { normalizeKeyPath } from '../utils';

import { FatFormContext, FatFormInheritanceContext, FatFormCollectionContext } from './constants';
import { FatFormMethods, FatFormCollection } from './types';

export function provideFatFormCollection(collection: FatFormCollection) {
  provide(FatFormCollectionContext, collection);
}

export function useFatFormCollection() {
  return inject(FatFormCollectionContext, null);
}

/**
 * fat-form 实例引用
 * @returns
 */
export function useFatFormRef<S extends {} = any>() {
  return ref<FatFormMethods<S>>();
}

export function useFatFormContext() {
  return inject(FatFormContext, null);
}

export function useInheritableProps() {
  return inject(FatFormInheritanceContext);
}

export const useFatFormInheritableProps = useInheritableProps;

export function useTouches() {
  let touched: Record<string, boolean> = {};
  const np = memoize(normalizeKeyPath);

  const touch = (prop: string) => {
    touched[np(prop)] = true;
  };

  const untouch = (prop: string) => {
    const k = np(prop);

    if (k in touched) {
      touched[k] = false;
    }
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
    untouch,
    isTouched,
    clear,
    getAllTouches,
  };
}
