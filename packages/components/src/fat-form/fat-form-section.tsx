import { declareComponent, declareProps, declareSlots } from '@wakeadmin/h';
import { onBeforeUnmount, markRaw, computed, provide } from '@wakeadmin/demi';
import { Noop } from '@wakeadmin/utils';

import { normalizeClassName, ToHSlotDefinition, pickEnumerable, inheritProps } from '../utils';
import { FatCard, FatCardSlots } from '../fat-layout';

import { FatFormSectionProps } from './types';
import { useFatFormCollection, useFatFormContext, useInheritableProps } from './hooks';
import { FatFormInheritanceContext } from './constants';

export const FatFormSection = declareComponent({
  name: 'FatFormSection',
  props: declareProps<FatFormSectionProps<any>>({
    disabled: { type: [Boolean, Function] as any, default: undefined },
  }),
  slots: declareSlots<ToHSlotDefinition<FatCardSlots>>(),
  setup(props, { attrs, slots }) {
    const form = useFatFormContext()!;
    const inherited = useInheritableProps();
    const collection = useFatFormCollection();

    const disabled = computed(() => {
      let d: boolean | undefined;
      if (typeof props.disabled === 'function') {
        d = props.disabled(form);
      } else {
        d = props.disabled;
      }

      return d ?? inherited?.disabled;
    });

    const drillDownProps = {
      get disabled() {
        return disabled.value;
      },
    };

    Object.setPrototypeOf(drillDownProps, inherited ?? {});

    provide(FatFormInheritanceContext, drillDownProps);

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
