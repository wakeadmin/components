import { provide, onUnmounted } from '@wakeadmin/demi';
import { declareComponent } from '@wakeadmin/h';
import { useDevtoolsExpose } from '../hooks';
import { normalizeClassName, renderSlot } from '../utils';
import { DropListRef } from './dropListRef';
import { FatDropListGroupToken } from './token';

export const FatDropListGroup = declareComponent({
  setup(props, { slots, attrs }) {
    const group: Set<DropListRef> = new Set();
    provide(FatDropListGroupToken, group);
    onUnmounted(() => {
      group.clear();
    });
    useDevtoolsExpose({
      dropListGroup: group,
    });
    return () => (
      <div class={normalizeClassName('fat-drop-list-group', attrs.class)} style={attrs.style}>
        {renderSlot(props, slots, 'default')}
      </div>
    );
  },
});
