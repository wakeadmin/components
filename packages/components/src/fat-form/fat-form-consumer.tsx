import { declareComponent, declareSlots, declareProps } from '@wakeadmin/h';
import { ToHSlotDefinition } from '../utils';
import { useFatFormContext } from './hooks';
import { FatFormConsumerProps } from './types';

/**
 * 获取表单实例，用于实现表单联动场景
 */
export const FatFormConsumer = declareComponent({
  name: 'FatFormConsumer',
  props: declareProps<FatFormConsumerProps>(['renderDefault']),
  slots: declareSlots<ToHSlotDefinition<FatFormConsumerProps<any>>>(),
  setup(props, { slots }) {
    const form = useFatFormContext()!;

    return () => {
      return slots.default ? slots.default(form) : props.renderDefault?.(form);
    };
  },
});
