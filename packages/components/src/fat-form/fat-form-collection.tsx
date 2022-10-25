import { declareComponent, declareProps } from '@wakeadmin/h';
import { provideFatFormCollection } from './hooks';
import { FatFormCollection } from './types';

export const FatFormCollectionProvider = declareComponent({
  name: 'FatFormItemCollection',
  props: declareProps<{ value: FatFormCollection }>({
    value: null,
  }),
  setup(props, { slots }) {
    provideFatFormCollection(props.value);

    return () => {
      return slots.default?.();
    };
  },
});
