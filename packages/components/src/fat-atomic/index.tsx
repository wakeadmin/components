import { declareComponent, declareProps } from '@wakeadmin/h';
import { computed } from '@wakeadmin/demi';

import { AtomicCommonProps, GetAtomicProps } from '../atomic';
import { useAtomicRegistry } from '../hooks';
import { OurComponentInstance, transformListeners } from '../utils';

type FatAtomicPropsInner<
  ValueType extends keyof AtomicProps = 'text',
  Props extends AtomicCommonProps<any> = GetAtomicProps<ValueType>
> = {
  valueType?: ValueType;
} & Omit<Props, 'value' | 'onChange'> & {
    modelValue?: Props['value'];
    'onUpdate:modelValue'?: Props['onChange'];
  };

// @ts-expect-error
export type FatAtomicProps = keyof { [K in keyof AtomicProps as FatAtomicPropsInner<K>]: any };

/**
 * 独立使用 atomic
 */
export const FatAtomic = declareComponent({
  name: 'FatAtomic',
  props: declareProps<FatAtomicProps>(['valueType', 'modelValue']),
  setup(props, context) {
    const registry = useAtomicRegistry();

    const atom = computed(() => {
      const valueType = props.valueType ?? 'text';

      const a = typeof valueType === 'object' ? valueType : registry.registered(valueType);

      if (a == null) {
        throw new Error(`[fat-atomics] 未能识别类型为 ${valueType} 的原件`);
      }

      return a;
    });

    const handleChange = (...args: any[]) => context.emit('update:modelValue', ...args);

    return () => {
      return atom.value.component({
        value: props.modelValue,
        onChange: handleChange,

        // listeners
        ...transformListeners(),

        ...context.attrs,
        //  原件展示不支持插槽，可能会导致异常
        // 'v-slots': context.slots,
      });
    };
  },
}) as new <ValueType extends keyof AtomicProps>(props: FatAtomicPropsInner<ValueType>) => OurComponentInstance<
  typeof props,
  {},
  {},
  {}
>;
