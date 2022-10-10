import { computed } from '@wakeadmin/demi';

import { useLazyOptions } from '../../hooks';
import { memoizeTask } from '../../atomic/host';

import { ASelectOption } from './shared';
import { NoopArray } from '@wakeadmin/utils';

export function useOptions(props: { options?: ASelectOption[] | (() => Promise<ASelectOption[]>) }) {
  const options =
    typeof props.options === 'function' ? memoizeTask(props.options) : computed(() => props.options ?? NoopArray);

  const { loading, value } = useLazyOptions(options, []);

  return { loading, options: value };
}
