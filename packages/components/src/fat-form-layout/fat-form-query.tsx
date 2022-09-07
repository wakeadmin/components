// TODO: 需求不太确定
// 展开

import { ref } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { debounce } from 'lodash';

import { FatForm, FatFormMethods, FatFormProps } from '../fat-form';
import { inheritProps, pickEnumerable } from '../utils';

export type FatFormQueryProps<Store extends {}, Request extends {} = Store, Submit extends {} = Store> = FatFormProps<
  Store,
  Request,
  Submit
> & {
  /**
   * 是否在 query 变动时触发 submit, 默认开启
   */
  submitOnQueryChange?: boolean;

  /**
   * query 防抖时长，默认为 800ms
   */
  queryWatchDelay?: number;
};

export interface FatFormQueryMethods<S extends {}> {
  form: FatFormMethods<S>;
}

export function useFatFormQueryMethods<Store extends {}>() {
  return ref<FatFormQueryMethods<Store>>();
}

export const FatFormQuery = declareComponent({
  name: 'FatFormQuery',
  props: declareProps<FatFormQueryProps<any>>({
    layout: { type: String as any, default: 'inline' },
    submitText: null,
    submitOnQueryChange: { type: Boolean, default: true },
    queryWatchDelay: { type: Number, default: 800 },
  }),
  setup(props, { slots, expose, emit }) {
    const form = ref<FatFormMethods<any>>();

    expose({
      get form() {
        return form.value;
      },
    });

    const debounceSubmit = debounce(() => {
      form.value?.submit();
    }, props.queryWatchDelay);

    const handleValuesChange = (...args: any[]) => {
      // 透传
      emit('valuesChange', ...args);

      if (props.submitOnQueryChange) {
        debounceSubmit();
      }
    };

    return () => {
      return (
        <FatForm
          ref={form}
          layout={props.layout}
          submitText={props.submitText ?? '搜索'}
          onValuesChange={handleValuesChange}
          {...inheritProps(false)}
          v-slots={pickEnumerable(slots)}
        />
      );
    };
  },
});
