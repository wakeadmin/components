// TODO: 需求不太确定
// 展开
// query watch

import { ref } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';

import { FatForm, FatFormMethods, FatFormProps } from '../fat-form';
import { inheritProps, pickEnumerable } from '../utils';

export type FatFormQueryProps<S extends {}> = FatFormProps<S>;
export interface FatFormQueryMethods<S extends {}> {
  form: FatFormMethods<S>;
}

export const FatFormQuery = declareComponent({
  name: 'FatFormQuery',
  props: declareProps<FatFormQueryProps<any>>({
    layout: { type: String as any, default: 'inline' },
    submitText: null,
  }),
  setup(props, { slots, expose }) {
    const form = ref<FatFormMethods<any>>();

    expose({
      get form() {
        return form.value;
      },
    });

    return () => {
      return (
        <FatForm
          ref={form}
          layout={props.layout}
          submitText={props.submitText ?? '搜索'}
          {...inheritProps(false)}
          v-slots={pickEnumerable(slots)}
        />
      );
    };
  },
});
