import { onBeforeUnmount } from '@wakeadmin/demi';
import { Disposer } from '@wakeadmin/utils';

export function useDisposer() {
  const disposer = new Disposer();

  onBeforeUnmount(disposer.release);

  return disposer;
}
