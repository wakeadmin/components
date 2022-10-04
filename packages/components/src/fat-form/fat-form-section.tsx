import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { ref } from '@wakeadmin/demi';
import { ArrowDown, ArrowUp } from '@wakeadmin/icons';

import { normalizeClassName, hasSlots, renderSlot, ToHSlotDefinition } from '../utils';

import { FatFormSectionProps, FatFormSectionSlots } from './types';

export const FatFormSection = declareComponent({
  name: 'FatFormSection',
  props: declareProps<FatFormSectionProps>({
    title: String,
    collapsable: Boolean,
    defaultCollapse: Boolean,

    // slots
    renderTitle: null,
  }),
  slots: declareSlots<ToHSlotDefinition<FatFormSectionSlots>>(),
  setup(props, { attrs, slots }) {
    const collapsed = ref(!!props.defaultCollapse);

    const handleClick = () => {
      if (!props.collapsable) {
        return;
      }

      collapsed.value = !collapsed.value;
    };

    return () => {
      return (
        <div
          class={normalizeClassName(
            'fat-form-section',
            {
              'fat-form-section--collapsable': props.collapsable,
              'fat-form-section--collapsed': props.collapsable ? collapsed.value : false,
            },
            attrs.class
          )}
          style={attrs.style}
        >
          <div class="fat-form-section__title" onClick={handleClick}>
            {hasSlots(props, slots, 'title') ? renderSlot(props, slots, 'title') : props.title}
            <span class="fat-form-section__toggle">{!collapsed.value ? <ArrowDown /> : <ArrowUp />}</span>
          </div>
          <div class="fat-form-section__body">{slots.default?.()}</div>
        </div>
      );
    };
  },
});
