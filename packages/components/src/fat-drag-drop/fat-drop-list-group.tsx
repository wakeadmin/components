import { provide } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';
import { onUnmounted } from 'vue2';
import { useDevtoolsExpose } from '../hooks';
import { renderSlot } from '../utils';
import { DropListRef } from './dropListRef';
import { FatDropListGroupToken } from './token';

export const FatDropListGroup = declareComponent({
  setup(props, { slots }) {
    const group: Set<DropListRef> = new Set();
    provide(FatDropListGroupToken, group);
    onUnmounted(() => {
      group.clear();
    });
    useDevtoolsExpose({
      dropListGroup: group,
    });
    return () => <div class="fat-drop-list-group">{renderSlot(props, slots, 'default')}</div>;
  },
});
