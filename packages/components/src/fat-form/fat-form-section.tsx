import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { onBeforeUnmount, markRaw } from '@wakeadmin/demi';
import { Noop } from '@wakeadmin/utils';

import { normalizeClassName, ToHSlotDefinition, pickEnumerable, inheritProps } from '../utils';

import { FatFormSectionProps } from './types';
import { FatCard, FatCardSlots } from '../fat-layout';
import { useFatFormCollection } from './hooks';

export const FatFormSection = declareComponent({
  name: 'FatFormSection',
  props: declareProps<FatFormSectionProps>([]),
  slots: declareSlots<ToHSlotDefinition<FatCardSlots>>(),
  setup(_props, { attrs, slots }) {
    const collection = useFatFormCollection();

    const instance = markRaw({});

    const disposer = collection?.registerSection(instance);

    onBeforeUnmount(disposer ?? Noop);

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
