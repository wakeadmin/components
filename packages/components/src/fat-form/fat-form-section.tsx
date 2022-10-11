import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';

import { normalizeClassName, ToHSlotDefinition, pickEnumerable, inheritProps } from '../utils';

import { FatFormSectionProps } from './types';
import { FatCard, FatCardSlots } from '../fat-layout';

export const FatFormSection = declareComponent({
  name: 'FatFormSection',
  props: declareProps<FatFormSectionProps>([]),
  slots: declareSlots<ToHSlotDefinition<FatCardSlots>>(),
  setup(_props, { attrs, slots }) {
    return () => {
      return (
        <FatCard
          {...inheritProps(false)}
          class={normalizeClassName(attrs.class, 'fat-form-section')}
          style={attrs.style}
          v-slots={pickEnumerable(slots)}
        />
      );
    };
  },
});
