import { inject } from '@wakeadmin/demi';

import { FatFormContext } from './constants';

export function useFatFormContext() {
  return inject(FatFormContext);
}
