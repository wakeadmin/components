import { declareComponent, declareProps } from '@wakeadmin/h';
import { provideFatFormCollection } from './hooks';
import { FatFormItemCollection } from './types';

export const FatFormItemCollectionProvider = declareComponent({
  name: 'FatalFormItemCollection',
  props: declareProps<{ value: FatFormItemCollection }>({
    value: null,
  }),
  setup(props, { slots }) {
    provideFatFormCollection(props.value);

    return () => {
      return slots.default?.();
    };
  },
});
