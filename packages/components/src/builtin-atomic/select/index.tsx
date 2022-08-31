import { SelectProps, Select, Option, model, OptionProps, Message } from '@wakeadmin/component-adapter';
import { declareComponent, declareProps } from '@wakeadmin/h';
import { ref, watch, computed } from '@wakeadmin/demi';

import { AtomicCommonProps, defineAtomic, globalRegistry } from '../../atomic';
import { UNDEFINED_PLACEHOLDER } from '../../constants';

export type ASelectProps = AtomicCommonProps<string | number | boolean> &
  Omit<SelectProps, 'value' | 'onInput' | 'modelValue' | 'onUpdate:modelValue'> & {
    options?: OptionProps[] | (() => Promise<OptionProps[]>);
  };

const Inner = declareComponent({
  name: 'ASelectInner',
  props: declareProps<{ properties: ASelectProps }>(['properties']),
  setup(props) {
    const loading = ref(false);
    const options = ref<OptionProps[]>([]);

    const load = async (loader: () => Promise<OptionProps[]>) => {
      const isGivenUp = () => loader !== props.properties.options;

      try {
        loading.value = true;
        const results = await loader();

        if (!isGivenUp()) {
          options.value = results;
        }
      } catch (err) {
        console.error(err);
        Message.error(`下拉列表加载失败：${(err as Error).message}`);
      } finally {
        if (!isGivenUp()) {
          loading.value = false;
        }
      }
    };

    const active = computed(() => {
      return options.value.find(i => i.value === props.properties.value);
    });

    watch(
      () => props.properties.options,
      o => {
        if (typeof o === 'function') {
          load(o);
        } else if (o) {
          options.value = o;
        }
      },
      { immediate: true }
    );

    return () => {
      const { mode, value, onChange, ...other } = props.properties;

      if (mode === 'preview') {
        return <span>{active.value?.label ?? UNDEFINED_PLACEHOLDER}</span>;
      }

      return (
        <Select {...model(value, onChange!)} {...other}>
          {options.value.map((i, idx) => {
            return <Option key={i.value ?? idx} {...i}></Option>;
          })}
        </Select>
      );
    };
  },
});

export const ASelectComponent = (props: ASelectProps) => {
  return <Inner properties={props} />;
};

declare global {
  interface AtomicProps {
    select: ASelectProps;
  }
}

export const ASelect = defineAtomic({
  name: 'select',
  component: ASelectComponent,
  description: '下拉选择器',
  author: 'ivan-lee',
});

globalRegistry.register('select', ASelect);
