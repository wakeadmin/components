import { computed } from '@wakeadmin/demi';
import { ASelectOption } from './shared';
import { useLazyOptions } from '../../hooks';

export function useOptions(props: { options?: ASelectOption[] | (() => Promise<ASelectOption[]>) }) {
  const options = computed(() => props.options);
  const { loading, value } = useLazyOptions(options, []);

  return { loading, options: value };
}
