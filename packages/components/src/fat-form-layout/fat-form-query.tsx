// TODO: 需求不太确定
// 展开

import { computed, onMounted, ref } from '@wakeadmin/demi';
import { declareComponent, declareEmits, declareProps, declareSlots } from '@wakeadmin/h';
import { debounce } from 'lodash';
import { useFatConfigurable } from '../fat-configurable';

import { FatForm, FatFormGroup, FatFormMethods, FatFormProps, FatFormSlots, FatFormEvents } from '../fat-form';
import { FatFormPublicMethodKeys } from '../fat-form/constants';
import { useDisposer, useUid } from '../hooks';
import {
  forwardExpose,
  inheritProps,
  normalizeClassName,
  OurComponentInstance,
  pickEnumerable,
  ToHEmitDefinition,
  ToHSlotDefinition,
} from '../utils';

export type FatFormQuerySlots<Store extends {}> = FatFormSlots<Store>;

export type FatFormQueryEvent<Store extends {}, Submit extends {} = Store> = FatFormEvents<Store, Submit>;

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

export type FatFormQueryMethods<Store extends {}> = FatFormMethods<Store>;

export function useFatFormQueryRef<Store extends {} = any>() {
  return ref<FatFormQueryMethods<Store>>();
}

// 支持换行后自动对齐
export const FatFormQuerySubmitter = declareComponent({
  name: 'FatFormQuerySubmitter',
  setup(props, { slots }) {
    const uid = useUid();
    const id = `fat-submitter__${uid}`;
    const shouldAlignToLabel = ref(false);
    const cls = computed(() => {
      return `${id} fat-form-query__submitter ${shouldAlignToLabel.value ? 'fat-form-query__submitter--align' : ''}`;
    });
    const disposer = useDisposer();

    onMounted(() => {
      const el = document.querySelector(`.${id}`) as HTMLElement;
      if (el == null) {
        return;
      }

      const offsetParent = el.offsetParent;

      if (offsetParent) {
        const offsetPadding = Math.max(20, parseInt(getComputedStyle(offsetParent).paddingLeft));

        const calc = () => {
          if (el.offsetLeft < offsetPadding) {
            shouldAlignToLabel.value = true;
          } else {
            shouldAlignToLabel.value = false;
          }
        };

        const resizeObserver = new ResizeObserver(calc);
        resizeObserver.observe(offsetParent);
        disposer.push(() => resizeObserver.disconnect());

        calc();
      }
    });

    return () => {
      return (
        <FatFormGroup
          class={cls.value}
          labelWidth="auto"
          gutter="sm"
          col={false}
          label={shouldAlignToLabel.value ? 'a' : undefined}
          // @ts-expect-error
          id={id}
        >
          {slots.default?.()}
        </FatFormGroup>
      );
    };
  },
});

const FatFormQueryInner = declareComponent({
  name: 'FatFormQuery',
  props: declareProps<FatFormQueryProps<any>>({
    layout: { type: String as any, default: 'inline' },
    submitText: null,
    submitOnQueryChange: { type: Boolean, default: false },
    queryWatchDelay: { type: Number, default: 800 },
  }),
  emits: declareEmits<ToHEmitDefinition<FatFormEvents<any, any>>>(),
  slots: declareSlots<ToHSlotDefinition<FatFormQuerySlots<any>>>(),
  setup(props, { slots, attrs, expose, emit }) {
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
      // @ts-expect-error
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
          class={normalizeClassName('fat-form-query', attrs.class)}
          v-slots={pickEnumerable(slots, 'submitter')}
          renderSubmitter={f => {
            return <FatFormQuerySubmitter>{f.renderButtons()}</FatFormQuerySubmitter>;
          }}
        />
      );
    };
  },
});

export const FatFormQuery = FatFormQueryInner as new <
  Store extends {} = any,
  Request extends {} = Store,
  Submit extends {} = Store
>(
  props: FatFormQueryProps<Store, Request, Submit>
) => OurComponentInstance<
  typeof props,
  FatFormQuerySlots<Store>,
  FatFormQueryEvent<Store, Submit>,
  FatFormQueryMethods<Store>
>;
