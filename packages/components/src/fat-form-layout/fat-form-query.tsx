// TODO: 需求不太确定
// 展开
// allowClear

import { ref } from '@wakeadmin/demi';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { debounce } from 'lodash';
import { useFatConfigurable } from '../fat-configurable';

import { FatForm, FatFormMethods, FatFormProps } from '../fat-form';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { forwardExpose, inheritProps, pickEnumerable } from '../utils';

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

export type FatFormQueryMethods<S extends {}> = FatFormMethods<S>;

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
    const configurable = useFatConfigurable();

    const instance = {};
    forwardExpose(instance, FatFormPublicMethodKeys, form);

    expose(instance);

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
          submitText={props.submitText ?? configurable.fatForm?.searchText ?? '搜索'}
          onValuesChange={handleValuesChange}
          hierarchyConnect={false}
          clearable
          {...inheritProps(false)}
          v-slots={pickEnumerable(slots)}
        />
      );
    };
  },
});
