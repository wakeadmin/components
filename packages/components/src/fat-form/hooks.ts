import { inject } from '@wakeadmin/demi';

import { FatFormContext, FatFormInheritanceContext } from './constants';

export function useFatFormContext() {
  return inject(FatFormContext);
}

export function useInheritableProps() {
  return inject(FatFormInheritanceContext);
}
